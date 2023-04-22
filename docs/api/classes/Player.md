[yt-cast-receiver](../README.md) / Player

# Class: Player

`Player` abstract class that leaves playback functionality to implementors.

## Hierarchy

- `EventEmitter`

  ↳ **`Player`**

## Table of contents

### Constructors

- [constructor](Player.md#constructor)

### Accessors

- [autoplayMode](Player.md#autoplaymode)
- [cpn](Player.md#cpn)
- [logger](Player.md#logger)
- [queue](Player.md#queue)
- [status](Player.md#status)
- [zeroVolumeLevelOnMute](Player.md#zerovolumelevelonmute)

### Methods

- [doGetDuration](Player.md#dogetduration)
- [doGetPosition](Player.md#dogetposition)
- [doGetVolume](Player.md#dogetvolume)
- [doPause](Player.md#dopause)
- [doPlay](Player.md#doplay)
- [doResume](Player.md#doresume)
- [doSeek](Player.md#doseek)
- [doSetVolume](Player.md#dosetvolume)
- [doStop](Player.md#dostop)
- [getDuration](Player.md#getduration)
- [getNavInfo](Player.md#getnavinfo)
- [getPosition](Player.md#getposition)
- [getState](Player.md#getstate)
- [getVolume](Player.md#getvolume)
- [next](Player.md#next)
- [notifyExternalStateChange](Player.md#notifyexternalstatechange)
- [pause](Player.md#pause)
- [play](Player.md#play)
- [previous](Player.md#previous)
- [reset](Player.md#reset)
- [resume](Player.md#resume)
- [seek](Player.md#seek)
- [setVolume](Player.md#setvolume)
- [stop](Player.md#stop)

### Events

- [on](Player.md#on)

## Constructors

### constructor

• **new Player**()

#### Overrides

EventEmitter.constructor

#### Defined in

[lib/Player.ts:117](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L117)

## Accessors

### autoplayMode

• `get` **autoplayMode**(): [`AutoplayMode`](../README.md#autoplaymode)

#### Returns

[`AutoplayMode`](../README.md#autoplaymode)

#### Defined in

[lib/Player.ts:380](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L380)

___

### cpn

• `get` **cpn**(): `string`

#### Returns

`string`

#### Defined in

[lib/Player.ts:384](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L384)

___

### logger

• `get` **logger**(): [`Logger`](../interfaces/Logger.md)

#### Returns

[`Logger`](../interfaces/Logger.md)

#### Defined in

[lib/Player.ts:372](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L372)

___

### queue

• `get` **queue**(): [`Playlist`](Playlist.md)

#### Returns

[`Playlist`](Playlist.md)

#### Defined in

[lib/Player.ts:388](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L388)

___

### status

• `get` **status**(): [`PlayerStatus`](../README.md#playerstatus)

#### Returns

[`PlayerStatus`](../README.md#playerstatus)

#### Defined in

[lib/Player.ts:376](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L376)

___

### zeroVolumeLevelOnMute

• `get` **zeroVolumeLevelOnMute**(): `boolean`

#### Returns

`boolean`

#### Defined in

[lib/Player.ts:392](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L392)

## Methods

### doGetDuration

▸ `Protected` `Abstract` **doGetDuration**(): `Promise`<`number`\>

Implementations shall return the duration of the current video.

#### Returns

`Promise`<`number`\>

Promise that resolves to the duration of the current video (in seconds).

#### Defined in

[lib/Player.ts:115](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L115)

___

### doGetPosition

▸ `Protected` `Abstract` **doGetPosition**(): `Promise`<`number`\>

Implementations shall return the current playback position.

#### Returns

`Promise`<`number`\>

Promise that resolves to the current playback position (in seconds).

#### Defined in

[lib/Player.ts:109](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L109)

___

### doGetVolume

▸ `Protected` `Abstract` **doGetVolume**(): `Promise`<[`Volume`](../interfaces/Volume.md)\>

Implementations shall return the current volume level and muted state.

#### Returns

`Promise`<[`Volume`](../interfaces/Volume.md)\>

Promise that resolves to an object with these properties:
  - `level`: (number) volume level between 0-100.
  - `muted`: (boolean) muted state.

#### Defined in

[lib/Player.ts:103](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L103)

___

### doPause

▸ `Protected` `Abstract` **doPause**(): `Promise`<`boolean`\>

Implementations shall pause current playback.

#### Returns

`Promise`<`boolean`\>

Promise that resolves to `true` when playback was paused; `false` otherwise.

#### Defined in

[lib/Player.ts:66](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L66)

___

### doPlay

▸ `Protected` `Abstract` **doPlay**(`video`, `position`): `Promise`<`boolean`\>

Implementations shall play the target video from the specified position.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `video` | [`Video`](../interfaces/Video.md) | The target video to play. |
| `position` | `number` | The position, in seconds, from which to start playback. |

#### Returns

`Promise`<`boolean`\>

Promise that resolves to `true` on successful playback; `false` otherwise.

#### Defined in

[lib/Player.ts:60](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L60)

___

### doResume

▸ `Protected` `Abstract` **doResume**(): `Promise`<`boolean`\>

Implementations shall resume paused playback.

#### Returns

`Promise`<`boolean`\>

Promise that resolves to `true` when playback was resumed; `false` otherwise.

#### Defined in

[lib/Player.ts:72](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L72)

___

### doSeek

▸ `Protected` `Abstract` **doSeek**(`position`): `Promise`<`boolean`\>

Implementations shall seek to the specified position.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `position` | `number` | The position, in seconds, to seek to. |

#### Returns

`Promise`<`boolean`\>

Promise that resolves to `true` if seek operation was successful; `false` otherwise.

#### Defined in

[lib/Player.ts:86](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L86)

___

### doSetVolume

▸ `Protected` `Abstract` **doSetVolume**(`volume`): `Promise`<`boolean`\>

Implementations shall set the volume level and muted state to the values specified in the `volume` object param.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `volume` | [`Volume`](../interfaces/Volume.md) | (object) - `level`: (number) volume level between 0-100. - `muted`: (boolean) muted state. |

#### Returns

`Promise`<`boolean`\>

Promise that resolves to `true` when volume was set; `false` otherwise.

#### Defined in

[lib/Player.ts:95](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L95)

___

### doStop

▸ `Protected` `Abstract` **doStop**(): `Promise`<`boolean`\>

Implementations shall stop current playback or cancel any pending playback (such as when
a video is still being loaded).

#### Returns

`Promise`<`boolean`\>

Promise that resolves to `true` when playback was stopped or pending playback was cancelled; `false` otherwise.

#### Defined in

[lib/Player.ts:79](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L79)

___

### getDuration

▸ **getDuration**(): `Promise`<`number`\>

Calls `doGetDuration()`

#### Returns

`Promise`<`number`\>

Promise returned by `doGetDuration()`.

#### Defined in

[lib/Player.ts:356](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L356)

___

### getNavInfo

▸ **getNavInfo**(): [`PlayerNavInfo`](../interfaces/PlayerNavInfo.md)

#### Returns

[`PlayerNavInfo`](../interfaces/PlayerNavInfo.md)

#### Defined in

[lib/Player.ts:396](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L396)

___

### getPosition

▸ **getPosition**(): `Promise`<`number`\>

Calls `doGetPosition()`.

#### Returns

`Promise`<`number`\>

Promise returned by `doGetPosition()`.

#### Defined in

[lib/Player.ts:348](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L348)

___

### getState

▸ **getState**(): `Promise`<[`PlayerState`](../interfaces/PlayerState.md)\>

#### Returns

`Promise`<[`PlayerState`](../interfaces/PlayerState.md)\>

#### Defined in

[lib/Player.ts:404](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L404)

___

### getVolume

▸ **getVolume**(): `Promise`<[`Volume`](../interfaces/Volume.md)\>

Calls `doGetVolume()`.

#### Returns

`Promise`<[`Volume`](../interfaces/Volume.md)\>

Promise that resolves to the resolved result of `doGetVolume()`.

#### Defined in

[lib/Player.ts:336](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L336)

___

### next

▸ **next**(`AID?`): `Promise`<`boolean`\>

Plays the next video in the player queue. If already reached end of queue,
play autoplay video if available. Notifies senders on successful playback.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `AID?` | ``null`` \| `number` | Internal use; do not specify. |

#### Returns

`Promise`<`boolean`\>

Promise that resolves to `true` on playback of the next video; `false` otherwise.

#### Defined in

[lib/Player.ts:248](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L248)

___

### notifyExternalStateChange

▸ **notifyExternalStateChange**(`newStatus?`): `Promise`<`void`\>

Signals that there has been a change in player state that is not captured elsewhere
in the `Player` implementation. This method will update the `Player` instance's
internal state and, if necessary, notifies senders of the new player state.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `newStatus?` | [`PlayerStatus`](../README.md#playerstatus) | The new player status; `undefined` for no change in player status. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/Player.ts:435](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L435)

___

### pause

▸ **pause**(`AID?`): `Promise`<`boolean`\>

Calls `doPause()`; if returned Promise resolves to `true`, notifies connected senders that playback has paused.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `AID?` | ``null`` \| `number` | Internal use; do not specify. |

#### Returns

`Promise`<`boolean`\>

Promise that resolves to the resolved result of `doPause()`, or `false` if no playback is in progress.

#### Defined in

[lib/Player.ts:164](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L164)

___

### play

▸ **play**(`video`, `position?`, `AID?`): `Promise`<`boolean`\>

Notifies senders that player is in 'loading' state, then calls `doPlay()`;
if returned Promise resolves to `true`, notifies senders that playback has started.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `video` | [`Video`](../interfaces/Video.md) | The target video to play. |
| `position?` | `number` | The position (in seconds) from which to start playback. |
| `AID?` | ``null`` \| `number` | Internal use; do not specify. |

#### Returns

`Promise`<`boolean`\>

Promise that resolves to the resolved result of `doPlay()`.

#### Defined in

[lib/Player.ts:141](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L141)

___

### previous

▸ **previous**(`AID?`): `Promise`<`boolean`\>

Plays the previous video in the player queue. Notifies senders on successful playback.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `AID?` | ``null`` \| `number` | Internal use; do not specify. |

#### Returns

`Promise`<`boolean`\>

Promise that resolves to `true` on playback of the previous video; `false` otherwise.

#### Defined in

[lib/Player.ts:280](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L280)

___

### reset

▸ **reset**(`AID?`): `Promise`<`void`\>

Resets the player to Idle state.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `AID?` | ``null`` \| `number` | Internal use; do not specify. |

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/Player.ts:324](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L324)

___

### resume

▸ **resume**(`AID?`): `Promise`<`boolean`\>

Calls `doResume()`; if returned Promise resolves to `true`, notifies connected senders that playback has resumed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `AID?` | ``null`` \| `number` | Internal use; do not specify. |

#### Returns

`Promise`<`boolean`\>

Promise that resolves to the resolved result of `doResume()`, or `false` if player is not in paused state.

#### Defined in

[lib/Player.ts:181](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L181)

___

### seek

▸ **seek**(`position`, `AID?`): `Promise`<`boolean`\>

Calls `doSeek()`; if returned Promise resolves to `true`, notifies connected senders of new seek position.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `position` | `number` | The position, in seconds, to seek to. |
| `AID?` | ``null`` \| `number` | Internal use; do not specify. |

#### Returns

`Promise`<`boolean`\>

Promise that resolves to the resolved result of `doSeek()`; `false` if no playback is in progress or otherwise not in paused state.

#### Defined in

[lib/Player.ts:224](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L224)

___

### setVolume

▸ **setVolume**(`volume`, `AID?`): `Promise`<`boolean`\>

Calls `doSetVolume()`; if returned Promise resolves to `true`, notifies connected senders of new volume level.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `volume` | [`Volume`](../interfaces/Volume.md) | (object) - `level`: (number) volume level between 0-100. - `muted`: (boolean) muted state. |
| `AID?` | ``null`` \| `number` | Internal use; do not specify. |

#### Returns

`Promise`<`boolean`\>

Promise that resolves to the resolved result of `doSetVolume()`.

#### Defined in

[lib/Player.ts:304](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L304)

___

### stop

▸ **stop**(`AID?`): `Promise`<`boolean`\>

Calls `doStop()`; if returned Promise resolves to `true`, notifies connected senders that playback has stopped.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `AID?` | ``null`` \| `number` | Internal use; do not specify. |

#### Returns

`Promise`<`boolean`\>

A Promise that resolves to the result of `doStop()`; `true` if player already in stopped or idle state.

#### Defined in

[lib/Player.ts:205](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L205)

## Events

### on

▸ **on**(`event`, `listener`): [`Player`](Player.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`Player`](Player.md)

#### Overrides

EventEmitter.on

#### Defined in

[lib/Player.ts:440](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L440)

▸ **on**(`event`, `listener`): [`Player`](Player.md)

Emitted when there has been a change in player state.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"state"`` |
| `listener` | (`data`: { `AID`: `string` ; `current`: [`PlayerState`](../interfaces/PlayerState.md) ; `previous`: ``null`` \| [`PlayerState`](../interfaces/PlayerState.md)  }) => `void` |

#### Returns

[`Player`](Player.md)

#### Overrides

EventEmitter.on

#### Defined in

[lib/Player.ts:446](https://github.com/patrickkfkan/yt-cast-receiver/blob/7694e32/src/lib/Player.ts#L446)