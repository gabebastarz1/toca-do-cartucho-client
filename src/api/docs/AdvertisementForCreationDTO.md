# AdvertisementForCreationDTO


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**availableStock** | **number** |  | [optional] [default to undefined]
**preservationStateId** | **number** |  | [default to undefined]
**cartridgeTypeId** | **number** |  | [default to undefined]
**gameLocalizationId** | **number** |  | [optional] [default to undefined]
**languageSupportsIds** | **Array&lt;number&gt;** |  | [optional] [default to undefined]
**gameId** | **number** |  | [default to undefined]
**price** | **number** |  | [optional] [default to undefined]
**isTrade** | **boolean** |  | [optional] [default to undefined]
**acceptedTradeGameIds** | **Array&lt;number&gt;** |  | [optional] [default to undefined]
**acceptedTradeCartridgeTypeIds** | **Array&lt;number&gt;** |  | [optional] [default to undefined]
**acceptedTradePreservationStateIds** | **Array&lt;number&gt;** |  | [optional] [default to undefined]
**variations** | [**Array&lt;AdvertisementVariationForCreationDTO&gt;**](AdvertisementVariationForCreationDTO.md) |  | [optional] [default to undefined]

## Example

```typescript
import { AdvertisementForCreationDTO } from './api';

const instance: AdvertisementForCreationDTO = {
    title,
    description,
    availableStock,
    preservationStateId,
    cartridgeTypeId,
    gameLocalizationId,
    languageSupportsIds,
    gameId,
    price,
    isTrade,
    acceptedTradeGameIds,
    acceptedTradeCartridgeTypeIds,
    acceptedTradePreservationStateIds,
    variations,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
