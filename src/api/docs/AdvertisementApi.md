# AdvertisementApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiAdvertisementsGet**](#apiadvertisementsget) | **GET** /api/advertisements | |
|[**apiAdvertisementsIdDelete**](#apiadvertisementsiddelete) | **DELETE** /api/advertisements/{id} | |
|[**apiAdvertisementsIdGet**](#apiadvertisementsidget) | **GET** /api/advertisements/{id} | |
|[**apiAdvertisementsIdPatch**](#apiadvertisementsidpatch) | **PATCH** /api/advertisements/{id} | |
|[**apiAdvertisementsPost**](#apiadvertisementspost) | **POST** /api/advertisements | |

# **apiAdvertisementsGet**
> apiAdvertisementsGet()


### Example

```typescript
import {
    AdvertisementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdvertisementApi(configuration);

let title: string; // (optional) (default to undefined)
let description: string; // (optional) (default to undefined)
let maxPrice: number; // (optional) (default to undefined)
let minPrice: number; // (optional) (default to undefined)
let status: AdvertisementStatusNullable; // (optional) (default to undefined)
let preservationStateIds: Array<number>; // (optional) (default to undefined)
let cartridgeTypeIds: Array<number>; // (optional) (default to undefined)
let sellerIds: Array<string>; // (optional) (default to undefined)
let gameIds: Array<number>; // (optional) (default to undefined)
let isTrade: boolean; // (optional) (default to undefined)
let isSale: boolean; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiAdvertisementsGet(
    title,
    description,
    maxPrice,
    minPrice,
    status,
    preservationStateIds,
    cartridgeTypeIds,
    sellerIds,
    gameIds,
    isTrade,
    isSale
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **title** | [**string**] |  | (optional) defaults to undefined|
| **description** | [**string**] |  | (optional) defaults to undefined|
| **maxPrice** | [**number**] |  | (optional) defaults to undefined|
| **minPrice** | [**number**] |  | (optional) defaults to undefined|
| **status** | **AdvertisementStatusNullable** |  | (optional) defaults to undefined|
| **preservationStateIds** | **Array&lt;number&gt;** |  | (optional) defaults to undefined|
| **cartridgeTypeIds** | **Array&lt;number&gt;** |  | (optional) defaults to undefined|
| **sellerIds** | **Array&lt;string&gt;** |  | (optional) defaults to undefined|
| **gameIds** | **Array&lt;number&gt;** |  | (optional) defaults to undefined|
| **isTrade** | [**boolean**] |  | (optional) defaults to undefined|
| **isSale** | [**boolean**] |  | (optional) defaults to undefined|


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

# **apiAdvertisementsIdDelete**
> apiAdvertisementsIdDelete()


### Example

```typescript
import {
    AdvertisementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdvertisementApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiAdvertisementsIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


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

# **apiAdvertisementsIdGet**
> apiAdvertisementsIdGet()


### Example

```typescript
import {
    AdvertisementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdvertisementApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiAdvertisementsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


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

# **apiAdvertisementsIdPatch**
> apiAdvertisementsIdPatch()


### Example

```typescript
import {
    AdvertisementApi,
    Configuration,
    AdvertisementForUpdateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new AdvertisementApi(configuration);

let id: number; // (default to undefined)
let advertisementForUpdateDTO: AdvertisementForUpdateDTO; // (optional)

const { status, data } = await apiInstance.apiAdvertisementsIdPatch(
    id,
    advertisementForUpdateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **advertisementForUpdateDTO** | **AdvertisementForUpdateDTO**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdvertisementsPost**
> apiAdvertisementsPost()


### Example

```typescript
import {
    AdvertisementApi,
    Configuration,
    AdvertisementForCreationDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new AdvertisementApi(configuration);

let advertisementForCreationDTO: AdvertisementForCreationDTO; // (optional)

const { status, data } = await apiInstance.apiAdvertisementsPost(
    advertisementForCreationDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **advertisementForCreationDTO** | **AdvertisementForCreationDTO**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

