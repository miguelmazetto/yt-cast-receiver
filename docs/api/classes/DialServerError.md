[yt-cast-receiver](../README.md) / DialServerError

# Class: DialServerError

## Hierarchy

- [`YouTubeCastReceiverError`](YouTubeCastReceiverError.md)

  ↳ **`DialServerError`**

## Table of contents

### Constructors

- [constructor](DialServerError.md#constructor)

### Properties

- [cause](DialServerError.md#cause)
- [info](DialServerError.md#info)

### Methods

- [getCauses](DialServerError.md#getcauses)

## Constructors

### constructor

• **new DialServerError**(`message`, `cause?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |
| `cause?` | `any` |

#### Overrides

[YouTubeCastReceiverError](YouTubeCastReceiverError.md).[constructor](YouTubeCastReceiverError.md#constructor)

#### Defined in

[src/lib/utils/Errors.ts:78](https://github.com/patrickkfkan/yt-cast-receiver/blob/91904fb/src/lib/utils/Errors.ts#L78)

## Properties

### cause

• `Optional` **cause**: `any`

#### Inherited from

[YouTubeCastReceiverError](YouTubeCastReceiverError.md).[cause](YouTubeCastReceiverError.md#cause)

#### Defined in

[src/lib/utils/Errors.ts:3](https://github.com/patrickkfkan/yt-cast-receiver/blob/91904fb/src/lib/utils/Errors.ts#L3)

___

### info

• `Optional` **info**: `Record`<`string`, `any`\>

#### Inherited from

[YouTubeCastReceiverError](YouTubeCastReceiverError.md).[info](YouTubeCastReceiverError.md#info)

#### Defined in

[src/lib/utils/Errors.ts:4](https://github.com/patrickkfkan/yt-cast-receiver/blob/91904fb/src/lib/utils/Errors.ts#L4)

## Methods

### getCauses

▸ **getCauses**(): `any`[]

#### Returns

`any`[]

#### Inherited from

[YouTubeCastReceiverError](YouTubeCastReceiverError.md).[getCauses](YouTubeCastReceiverError.md#getcauses)

#### Defined in

[src/lib/utils/Errors.ts:17](https://github.com/patrickkfkan/yt-cast-receiver/blob/91904fb/src/lib/utils/Errors.ts#L17)
