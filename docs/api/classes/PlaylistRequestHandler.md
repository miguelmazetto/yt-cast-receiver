[yt-cast-receiver](../README.md) / PlaylistRequestHandler

# Class: PlaylistRequestHandler

Handles requests made by a `Playlist` instance.

## Hierarchy

- **`PlaylistRequestHandler`**

  ↳ [`DefaultPlaylistRequestHandler`](DefaultPlaylistRequestHandler.md)

## Table of contents

### Constructors

- [constructor](PlaylistRequestHandler.md#constructor)

### Accessors

- [logger](PlaylistRequestHandler.md#logger)

### Methods

- [getPreviousNextVideos](PlaylistRequestHandler.md#getpreviousnextvideos)
- [getPreviousNextVideosAbortable](PlaylistRequestHandler.md#getpreviousnextvideosabortable)
- [reset](PlaylistRequestHandler.md#reset)
- [setLogger](PlaylistRequestHandler.md#setlogger)

## Constructors

### constructor

• **new PlaylistRequestHandler**()

## Accessors

### logger

• `get` **logger**(): [`Logger`](../interfaces/Logger.md)

#### Returns

[`Logger`](../interfaces/Logger.md)

#### Defined in

[src/lib/app/PlaylistRequestHandler.ts:66](https://github.com/patrickkfkan/yt-cast-receiver/blob/91904fb/src/lib/app/PlaylistRequestHandler.ts#L66)

## Methods

### getPreviousNextVideos

▸ `Abstract` **getPreviousNextVideos**(`target`, `playlist`): `Promise`<[`PlaylistPreviousNextVideos`](../interfaces/PlaylistPreviousNextVideos.md)\>

Given `target` video that resides in `playlist`, implementations shall fetch
the previous and next videos in the list.

If `target` is already the last video in the list, then fetch the autoplay video
in lieu of next video. You may optionally check first whether autoplay is enabled
with `playlist.autoplayMode`, and return `null` for next video if it is not.
The object returned by this method shall have the following properties:
- `previous`: object representing the previous video in the list, or `null` if there is none.
- `next`: object representing the next video in the list or autoplay video, as the case may be, or `null` if there is none.
Instead of `null`, you may simply omit `previous` or `next` from the returned result. But if provided, they
must satisfy the [Video](../interfaces/Video.md) interface constraint.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `target` | [`Video`](../interfaces/Video.md) | Target video for which the previous and next videos are obtained. |
| `playlist` | [`Playlist`](Playlist.md) | The `Playlist` instance making the request. |

#### Returns

`Promise`<[`PlaylistPreviousNextVideos`](../interfaces/PlaylistPreviousNextVideos.md)\>

(Object)

#### Defined in

[src/lib/app/PlaylistRequestHandler.ts:56](https://github.com/patrickkfkan/yt-cast-receiver/blob/91904fb/src/lib/app/PlaylistRequestHandler.ts#L56)

___

### getPreviousNextVideosAbortable

▸ **getPreviousNextVideosAbortable**(`target`, `playlist`, `abortSignal`): `Promise`<[`PlaylistPreviousNextVideos`](../interfaces/PlaylistPreviousNextVideos.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | [`Video`](../interfaces/Video.md) |
| `playlist` | [`Playlist`](Playlist.md) |
| `abortSignal` | `AbortSignal` |

#### Returns

`Promise`<[`PlaylistPreviousNextVideos`](../interfaces/PlaylistPreviousNextVideos.md)\>

#### Defined in

[src/lib/app/PlaylistRequestHandler.ts:22](https://github.com/patrickkfkan/yt-cast-receiver/blob/91904fb/src/lib/app/PlaylistRequestHandler.ts#L22)

___

### reset

▸ **reset**(): `void`

Resets the handler to its initial state. By default, this method does nothing.
Implementations shall override this method if need be.

#### Returns

`void`

#### Defined in

[src/lib/app/PlaylistRequestHandler.ts:62](https://github.com/patrickkfkan/yt-cast-receiver/blob/91904fb/src/lib/app/PlaylistRequestHandler.ts#L62)

___

### setLogger

▸ **setLogger**(`logger`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`Logger`](../interfaces/Logger.md) |

#### Returns

`void`

#### Defined in

[src/lib/app/PlaylistRequestHandler.ts:18](https://github.com/patrickkfkan/yt-cast-receiver/blob/91904fb/src/lib/app/PlaylistRequestHandler.ts#L18)
