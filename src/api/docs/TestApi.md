# TestApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiDebuggingHelloWorldGet**](#apidebugginghelloworldget) | **GET** /api/debugging/hello-world | |

# **apiDebuggingHelloWorldGet**
> apiDebuggingHelloWorldGet()


### Example

```typescript
import {
    TestApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestApi(configuration);

const { status, data } = await apiInstance.apiDebuggingHelloWorldGet();
```

### Parameters
This endpoint does not have any parameters.


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

