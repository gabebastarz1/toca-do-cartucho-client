# AdvertisementImageApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiAdvertisementsAdvertisementIdImagePost**](#apiadvertisementsadvertisementidimagepost) | **POST** /api/advertisements/{advertisementId}/image | |
|[**apiAdvertisementsAdvertisementIdImagesPost**](#apiadvertisementsadvertisementidimagespost) | **POST** /api/advertisements/{advertisementId}/images | |
|[**apiAdvertisementsIdImagesGet**](#apiadvertisementsidimagesget) | **GET** /api/advertisements/{id}/images | |
|[**apiAdvertisementsImagesIdDelete**](#apiadvertisementsimagesiddelete) | **DELETE** /api/advertisements/images/{id} | |

# **apiAdvertisementsAdvertisementIdImagePost**
> apiAdvertisementsAdvertisementIdImagePost()


### Example

```typescript
import {
    AdvertisementImageApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdvertisementImageApi(configuration);

let advertisementId: number; // (default to undefined)
let image: File; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiAdvertisementsAdvertisementIdImagePost(
    advertisementId,
    image
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **advertisementId** | [**number**] |  | defaults to undefined|
| **image** | [**File**] |  | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdvertisementsAdvertisementIdImagesPost**
> apiAdvertisementsAdvertisementIdImagesPost()


### Example

```typescript
import {
    AdvertisementImageApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdvertisementImageApi(configuration);

let advertisementId: number; // (default to undefined)
let images: Array<File>; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiAdvertisementsAdvertisementIdImagesPost(
    advertisementId,
    images
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **advertisementId** | [**number**] |  | defaults to undefined|
| **images** | **Array&lt;File&gt;** |  | (optional) defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiAdvertisementsIdImagesGet**
> apiAdvertisementsIdImagesGet()


### Example

```typescript
import {
    AdvertisementImageApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdvertisementImageApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiAdvertisementsIdImagesGet(
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

# **apiAdvertisementsImagesIdDelete**
> apiAdvertisementsImagesIdDelete()


### Example

```typescript
import {
    AdvertisementImageApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AdvertisementImageApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiAdvertisementsImagesIdDelete(
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

