# LanguageSupportApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiLanguageSupportsGet**](#apilanguagesupportsget) | **GET** /api/language-supports | |

# **apiLanguageSupportsGet**
> apiLanguageSupportsGet()


### Example

```typescript
import {
    LanguageSupportApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new LanguageSupportApi(configuration);

let gameId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiLanguageSupportsGet(
    gameId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **gameId** | [**number**] |  | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

