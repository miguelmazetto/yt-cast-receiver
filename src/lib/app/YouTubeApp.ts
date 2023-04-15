import EventEmitter from 'events';
import * as dial from '@patrickkfkan/peer-dial';
import queryString from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import Player, { AutoplayMode } from '../Player.js';
import Message from './Message.js';
import Session from './Session.js';
import PairingCodeRequestService from './PairingCodeRequestService.js';
import Sender from './Sender.js';
import { AppError, SenderConnectionError, IncompleteAPIDataError } from '../utils/Errors.js';
import Logger from '../utils/Logger.js';
import { AUTOPLAY_MODES, STATUSES, CONF_DEFAULTS, PLAYER_STATUSES } from '../Constants.js';
import { ValueOf } from '../utils/Type.js';
import PlaylistRequestHandler from './PlaylistRequestHandler.js';
import DefaultPlaylistRequestHandler from './DefaultPlaylistRequestHandler.js';

export interface AppOptions {
  /**
   * @default CONF_DEFAULTS.SCREEN_NAME
   */
  screenName?: string,
  /**
   * @default CONF_DEFAULTS.SCREEN_APP
   */
  screenApp?: string,
  /**
   * @default CONF_DEFAULTS.BRAND
   */
  brand?: string,
  /**
   * @default CONF_DEFAULTS.MODEL
   */
  model?: string,
  /**
   * @default true
   */
  enableAutoplayOnConnect?: boolean,
  /**
   * @default `DefaultPlaylistRequestHandler` instance
   */
  playlistRequestHandler?: PlaylistRequestHandler,
  logger: Logger
}

type AppStatus = ValueOf<typeof STATUSES>;

/**
 * @internal
 *
 * A `YouTubeApp` instance readies the cast environment, handles incoming messages
 * (responding to them as necessary), posts status updates, manages player state, etc..
 */
export default class YouTubeApp extends EventEmitter implements dial.App {
  name: string;
  state: AppStatus;
  allowStop: boolean;
  pid: string;

  #session: Session;
  #connectedSenders: Sender[];
  #logger: Logger;
  #player: Player;
  #autoplayModeOnConnect: typeof AUTOPLAY_MODES.ENABLED | typeof AUTOPLAY_MODES.DISABLED;
  #autoplayModeBeforeUnsupportedOverride: typeof AUTOPLAY_MODES.ENABLED | typeof AUTOPLAY_MODES.DISABLED | null;
  #playerStateListener: any;

  constructor(player: Player, options: AppOptions) {
    super();

    this.name = 'YouTube Cast Receiver App';
    this.state = STATUSES.STOPPED;
    this.allowStop = false;
    this.pid = uuidv4();

    this.#session = new Session({
      screenName: options.screenName || CONF_DEFAULTS.SCREEN_NAME,
      screenApp: options.screenApp || CONF_DEFAULTS.SCREEN_APP,
      brand: options.brand || CONF_DEFAULTS.BRAND,
      model: options.model || CONF_DEFAULTS.MODEL,
      logger: options.logger
    });

    this.#connectedSenders = [];
    this.#logger = options.logger;

    this.#player = player;
    this.#player.setLogger(options.logger);
    this.#player.queue.setRequestHandler(options.playlistRequestHandler || new DefaultPlaylistRequestHandler());
    this.#player.queue.requestHandler.setLogger(options.logger);
    this.#playerStateListener = this.#handlePlayerStateEvent.bind(this);
    this.enableAutoplayOnConnect(options.enableAutoplayOnConnect !== undefined ? options.enableAutoplayOnConnect : true);
    this.#autoplayModeBeforeUnsupportedOverride = null;
  }

  async start() {
    if (this.state !== STATUSES.STOPPED) {
      return;
    }
    this.#logger.debug('[yt-cast-receiver] Starting YouTubeApp...');
    this.state = STATUSES.STARTING;
    this.#player.on('state', this.#playerStateListener);
    this.#session.on('messages', this.#handleIncomingMessage.bind(this));
    this.#session.on('terminate', (error) => {
      // Session terminated. So should YouTubeApp.
      this.stop(error);
    });
    try {
      await this.#session.begin();
    }
    catch (error) {
      this.#player.removeListener('state', this.#playerStateListener);
      this.#session.removeAllListeners();
      this.state = STATUSES.STOPPED;
      throw new AppError('Failed to start YouTubeApp', error);
    }
    this.state = STATUSES.RUNNING;
  }

  // Implements
  async launch(launchData: string): Promise<string> {
    const parsedCode = queryString.parse(launchData).pairingCode;
    const code = Array.isArray(parsedCode) ? parsedCode[0] : parsedCode;
    if (code) {
      this.#logger.info('[yt-cast-receiver] Connecting sender through DIAL...');
      await this.#session.registerPairingCode(Array.isArray(code) ? code[0] : code);
      return this.pid;
    }

    throw new AppError('Failed to launch YouTubeApp',
      new IncompleteAPIDataError('Invalid launch data', [ 'pairingCode' ]));
  }

  async #setAutoplayMode(AID: number | null, value: AutoplayMode) {
    const stateBefore = this.#player.queue.getState();
    await this.#player.queue.setAutoplayMode(value);
    const stateAfter = this.#player.queue.getState();
    const sendMessages = [
      new Message.OnAutoplayModeChanged(AID, value)
    ];

    if (stateBefore.autoplay?.id !== stateAfter.autoplay?.id) {
      sendMessages.push(new Message.AutoplayUpNext(AID, stateAfter.autoplay?.id || null));
    }
    this.#session.sendMessage(sendMessages);
  }

  enableAutoplayOnConnect(value = false) {
    this.#autoplayModeOnConnect = value ? AUTOPLAY_MODES.ENABLED : AUTOPLAY_MODES.DISABLED;
  }

  async #handleIncomingMessage(message: Message | Message[]): Promise<void> {
    if (Array.isArray(message)) {
      for (const c of message) {
        await this.#handleIncomingMessage(c as Message);
      }
      return;
    }

    const { AID, name, payload } = message as Message;

    this.#logger.debug('-----------------------------------');
    this.#logger.debug(`[yt-cast-receiver] (AID: ${AID}) Incoming message: '${name}'`);

    const sendMessages = [];

    switch (name) {
      case 'remoteConnected':
        let newSender: Sender;
        try {
          newSender = Sender.parse(payload);
        }
        catch (err) {
          const error = new SenderConnectionError('Failed to register connected sender', err, 'connect');
          this.#logger.error('[yt-cast-receiver] Failed to handle \'remoteConnected\' message:', error);
          this.emit('error', error);
          break;
        }
        if (!this.#connectedSenders.find((c) => c.id === newSender.id)) {
          this.#logger.info(`[yt-cast-receiver] Sender connected: ${newSender.name}`);
          this.#logger.debug('[yt-cast-receiver] Connected sender info:', newSender);

          // Determine autoplay mode
          let autoplayMode: AutoplayMode;
          if (this.#connectedSenders.length === 0) {
            if (!newSender.supportsAutoplay()) {
              this.#logger.info('[yt-cast-receiver] Sender does not have autoplay capability. Autoplay support disabled.');
              autoplayMode = AUTOPLAY_MODES.UNSUPPORTED;
            }
            else {
              this.#logger.info(`[yt-cast-receiver] Sender has autoplay capability. Setting autoplay support to value of \`autoplayModeOnConnect\`: ${this.#autoplayModeOnConnect}`);
              autoplayMode = this.#autoplayModeOnConnect;
            }
            this.#autoplayModeBeforeUnsupportedOverride = null;
          }
          else if (!newSender.supportsAutoplay() || this.#connectedSenders.find((c) => !c.supportsAutoplay())) {
            // If any connected sender (including newSender) does not support
            // Autoplay, set autoplay mode to 'unsupported'.
            this.#logger.info('[yt-cast-receiver] One or more senders do not support autoplay. Autoplay support disabled.');
            if (this.#player.autoplayMode !== AUTOPLAY_MODES.UNSUPPORTED) {
              this.#autoplayModeBeforeUnsupportedOverride = this.#player.autoplayMode;
            }
            autoplayMode = AUTOPLAY_MODES.UNSUPPORTED;
          }
          else {
            // Stick to current autoplay mode
            autoplayMode = this.#player.autoplayMode;
            this.#autoplayModeBeforeUnsupportedOverride = null;
          }
          await this.#setAutoplayMode(AID, autoplayMode);

          const playerState = await this.#player.getState();
          sendMessages.push(new Message.NowPlaying(AID, playerState));
          sendMessages.push(new Message.OnStateChange(AID, playerState));

          this.#connectedSenders.push(newSender);
          this.emit('senderConnect', newSender);
        }
        else {
          this.#logger.debug('[yt-cast-receiver] Sender already connected.');
        }
        break;

      case 'remoteDisconnected':
        let disconnectedSender: Sender;
        try {
          disconnectedSender = Sender.parse(payload);
        }
        catch (err) {
          const error = new SenderConnectionError('Failed to unregister disconnected sender', err, 'disconnect');
          this.#logger.error('[yt-cast-receiver] Failed to handle \'remoteDisconnected\' message:', error);
          this.emit('error', error);
          break;
        }
        const disconnectedSenderIndex = this.#connectedSenders.findIndex((c) => c.id === disconnectedSender.id);
        if (disconnectedSenderIndex < 0) {
          this.#logger.warn('[yt-cast-receiver] Anomaly detected while unregistering disconnected sender: unable to find target among connected senders. Target:',
            disconnectedSender, ' Connected senders:', this.#connectedSenders);
          break;
        }
        this.#connectedSenders.splice(disconnectedSenderIndex, 1);

        if (this.#connectedSenders.length === 0) {
          await this.#player.reset();
        }
        else if (this.#player.autoplayMode === AUTOPLAY_MODES.UNSUPPORTED) {
          // Recheck autoplay mode
          if (this.#connectedSenders.every((c) => c.supportsAutoplay())) {
            this.#setAutoplayMode(AID, this.#autoplayModeBeforeUnsupportedOverride || this.#autoplayModeOnConnect);
          }
        }

        this.#logger.info(`[yt-cast-receiver] Sender disconnected: ${disconnectedSender.name}`);
        this.#logger.debug('[yt-cast-receiver] Disconnected sender info:', disconnectedSender);
        this.emit('senderDisconnect', disconnectedSender);
        break;

      case 'getNowPlaying':
        sendMessages.push(new Message.NowPlaying(AID, await this.#player.getState()));
        break;

      case 'loungeStatus':
        const playerNavInfo = this.#player.getNavInfo();
        sendMessages.push(
          new Message.OnHasPreviousNextChanged(AID, playerNavInfo),
          new Message.OnAutoplayModeChanged(AID, playerNavInfo)
        );
        break;

      case 'setPlaylist':
      case 'updatePlaylist':
        this.#logger.debug(`[yt-cast-receiver] '${message.name}' message payload:`, payload);
        const stateBeforeSet = this.#player.queue.getState();
        const navBeforeSet = this.#player.getNavInfo();
        await this.#player.queue.updateByMessage(message);
        const stateAfterSet = this.#player.queue.getState();
        const navAfterSet = this.#player.getNavInfo();
        if (stateBeforeSet.autoplay?.id !== stateAfterSet.autoplay?.id) {
          sendMessages.push(new Message.AutoplayUpNext(AID, stateAfterSet.autoplay?.id || null));
        }
        if (message.name === 'setPlaylist' && (stateBeforeSet.current?.id !== stateAfterSet.current?.id ||
          stateBeforeSet.current?.context?.index !== stateAfterSet.current?.context?.index)) {
          if (this.#player.status !== PLAYER_STATUSES.STOPPED) {
            await this.#player.stop(AID);
          }
          const currentVideo = stateAfterSet.current;
          if (currentVideo) {
            await this.#player.play(currentVideo, parseInt(payload.currentTime, 10) || 0, AID);
          }
        }
        else if (message.name === 'updatePlaylist' && !stateAfterSet.current) {
          await this.#player.stop(AID);
        }
        else {
          sendMessages.push(new Message.NowPlaying(AID, await this.#player.getState()));
          if (navBeforeSet.hasNext !== navAfterSet.hasNext || navBeforeSet.hasPrevious !== navAfterSet.hasPrevious) {
            sendMessages.push(new Message.OnHasPreviousNextChanged(AID, navAfterSet));
          }
        }
        break;

      case 'next':
        await this.#player.next(AID);
        break;

      case 'previous':
        await this.#player.previous(AID);
        break;

      case 'pause':
        await this.#player.pause(AID);
        break;

      case 'stopVideo':
        await this.#player.stop(AID);
        break;

      case 'seekTo':
        await this.#player.seek(parseInt(payload.newTime, 10));
        break;

      case 'getVolume':
        const volume = await this.#player.getVolume();
        sendMessages.push(new Message.OnVolumeChanged(AID, volume, false));
        break;

      case 'setVolume':
        const newVolume = parseInt(payload.volume, 10);
        const currentVolume = await this.#player.getVolume();
        if (newVolume !== currentVolume) {
          await this.#player.setVolume(newVolume, AID);
        }
        break;

      case 'play':
        await this.#player.resume(AID);
        break;

      case 'setAutoplayMode':
        await this.#setAutoplayMode(AID, payload.autoplayMode);
        break;

      default:
        this.#logger.debug(`[yt-cast-receiver] (AID: ${AID}) Not handled: '${name}'`);
    }

    if (sendMessages.length > 0) {
      this.#session.sendMessage(sendMessages);
    }
  }

  async stop(error?: Error) {
    if (this.state !== STATUSES.RUNNING && !error) {
      return;
    }

    this.#logger.debug('[yt-cast-receiver] Stopping YouTubeApp...');

    this.state = STATUSES.STOPPING;

    const senders = [ ...this.#connectedSenders ];
    this.#connectedSenders.splice(0);

    this.#player.removeListener('state', this.#playerStateListener);
    await this.#player.reset();

    this.#session.removeAllListeners();
    try {
      await this.#session.end();
    }
    catch (err) {
      this.#logger.warn('[yt-cast-receiver] Ignoring error while stopping YouTubeApp:', error);
    }

    this.state = STATUSES.STOPPED;

    senders.forEach((c) => {
      this.emit('senderDisconnect', c);
    });

    if (error) {
      this.emit('terminate', error);
    }
  }

  #handlePlayerStateEvent(payload: Record<string, any>) {
    const {AID, current, previous} = payload;

    if (this.#connectedSenders.length === 0) {
      this.#logger.debug('[yt-cast-receiver] Ignoring player state event because there is no connected sender.');
      return;
    }

    this.#logger.debug('[yt-cast-receiver] Player state changed from:', previous);
    this.#logger.debug('To:', current);

    let statusChanged = true, positionChanged = true,
      volumeChanged = true, nowPlayingChanged = true,
      autoplayChanged = true;
    if (previous) {
      statusChanged = previous.status !== current.status;
      positionChanged = previous.position !== current.position;
      volumeChanged = previous.volume !== current.volume;
      nowPlayingChanged = previous.playlist.current !== current.playlist.current ||
        previous.playlist.id !== current.playlist.id ||
        previous.playlist.currentIndex !== current.playlist.currentIndex;
      autoplayChanged = previous.playlist.autoplay?.id !== current.playlist.autoplay?.id;
    }

    const messages = [];
    if (nowPlayingChanged) {
      messages.push(
        new Message.NowPlaying(AID, current),
        new Message.OnHasPreviousNextChanged(AID, this.#player.getNavInfo())
      );
    }
    if (statusChanged || positionChanged) {
      messages.push(new Message.OnStateChange(AID, current));
    }
    if (volumeChanged) {
      messages.push(new Message.OnVolumeChanged(AID, current.volume, false));
    }
    if (autoplayChanged) {
      messages.push(new Message.AutoplayUpNext(AID, current.playlist.autoplay?.id || null));
    }

    if (messages.length > 0) {
      if (messages.every((c) => c instanceof Message.OnVolumeChanged && c.AID !== null)) {
        // We could be responding to a series of 'setVolume' messages. To reduce
        // Lag on sender side, we only send the latest 'onVolumeChanged' message after
        // A short interval of no further such messages.
        this.#session.sendMessage(messages, { key: 'onVolumeChanged', interval: 200 });
      }
      else {
        this.#session.sendMessage(messages);
      }
    }
  }

  getPairingCodeRequestService(): PairingCodeRequestService {
    return this.#session.pairingCodeRequestService;
  }

  get connectedSenders(): Sender[] {
    return [ ...this.#connectedSenders ];
  }

  /**
   * @event
   * Emitted when the `YouTubeApp` instance has terminated due to irrecoverable error.
   * @param listener.error - The error that triggered the event.
   */
  on(event: 'terminate', listener: (error: Error) => void): this;
  /**
   * @event
   * Emitted when an error has occurred.
   * @param listener.error - The error that triggered the event.
   */
  on(event: 'error', listener: (error: Error) => void): this;
  /**
   * @event
   * Emitted when a sender has connected.
   * @param listener.sender - The connected sender.
   */
  on(event: 'senderDisconnect', listener: (sender: Sender) => void): this;
  /**
   * @event
   * Emitted when a sender has disconnected.
   * @param listener.sender - The disconnected sender.
   */
  on(event: 'senderConnect', listener: (sender: Sender) => void): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    super.on(event, listener);
    return this;
  }
}
