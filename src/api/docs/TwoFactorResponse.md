# TwoFactorResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sharedKey** | **string** |  | [default to undefined]
**recoveryCodesLeft** | **number** |  | [default to undefined]
**recoveryCodes** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**isTwoFactorEnabled** | **boolean** |  | [default to undefined]
**isMachineRemembered** | **boolean** |  | [default to undefined]

## Example

```typescript
import { TwoFactorResponse } from './api';

const instance: TwoFactorResponse = {
    sharedKey,
    recoveryCodesLeft,
    recoveryCodes,
    isTwoFactorEnabled,
    isMachineRemembered,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
