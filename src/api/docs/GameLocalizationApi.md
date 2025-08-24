# GameLocalizationApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiGameLocalizationsGet**](#apigamelocalizationsget) | **GET** /api/game-localizations | |

# **apiGameLocalizationsGet**
> apiGameLocalizationsGet()


### Example

```typescript
import {
    GameLocalizationApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GameLocalizationApi(configuration);

let gameId: number; // (optional) (default to undefined)
let region: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiGameLocalizationsGet(
    gameId,
    region
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **gameId** | [**number**] |  | (optional) defaults to undefined|
| **region** | [**string**] |  | (optional) defaults to undefined|


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

