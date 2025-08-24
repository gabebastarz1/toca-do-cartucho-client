# GameApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiGamesGet**](#apigamesget) | **GET** /api/games | |

# **apiGamesGet**
> apiGamesGet()


### Example

```typescript
import {
    GameApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new GameApi(configuration);

let name: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiGamesGet(
    name
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] |  | (optional) defaults to undefined|


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

