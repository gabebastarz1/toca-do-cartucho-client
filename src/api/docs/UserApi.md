# UserApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiUsersFavoriteAdvertisementsIdDelete**](#apiusersfavoriteadvertisementsiddelete) | **DELETE** /api/users/favorite-advertisements/{id} | |
|[**apiUsersFavoriteAdvertisementsPost**](#apiusersfavoriteadvertisementspost) | **POST** /api/users/favorite-advertisements | |
|[**apiUsersGet**](#apiusersget) | **GET** /api/users | |
|[**apiUsersIdDelete**](#apiusersiddelete) | **DELETE** /api/users/{id} | |
|[**apiUsersIdGet**](#apiusersidget) | **GET** /api/users/{id} | |
|[**apiUsersIdPatch**](#apiusersidpatch) | **PATCH** /api/users/{id} | |
|[**apiUsersPatch**](#apiuserspatch) | **PATCH** /api/users | |
|[**apiUsersPost**](#apiuserspost) | **POST** /api/users | |
|[**apiUsersProfileInfoGet**](#apiusersprofileinfoget) | **GET** /api/users/profile-info | |
|[**apiUsersSecuredGet**](#apiuserssecuredget) | **GET** /api/users/secured | |

# **apiUsersFavoriteAdvertisementsIdDelete**
> apiUsersFavoriteAdvertisementsIdDelete()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.apiUsersFavoriteAdvertisementsIdDelete(
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

# **apiUsersFavoriteAdvertisementsPost**
> apiUsersFavoriteAdvertisementsPost()


### Example

```typescript
import {
    UserApi,
    Configuration,
    UserFavoriteAdvertisementsForCreationDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let userFavoriteAdvertisementsForCreationDTO: UserFavoriteAdvertisementsForCreationDTO; // (optional)

const { status, data } = await apiInstance.apiUsersFavoriteAdvertisementsPost(
    userFavoriteAdvertisementsForCreationDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userFavoriteAdvertisementsForCreationDTO** | **UserFavoriteAdvertisementsForCreationDTO**|  | |


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

# **apiUsersGet**
> apiUsersGet()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let cpf: string; // (optional) (default to undefined)
let email: string; // (optional) (default to undefined)
let fullName: string; // (optional) (default to undefined)
let nickName: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiUsersGet(
    cpf,
    email,
    fullName,
    nickName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **cpf** | [**string**] |  | (optional) defaults to undefined|
| **email** | [**string**] |  | (optional) defaults to undefined|
| **fullName** | [**string**] |  | (optional) defaults to undefined|
| **nickName** | [**string**] |  | (optional) defaults to undefined|


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

# **apiUsersIdDelete**
> apiUsersIdDelete()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.apiUsersIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


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

# **apiUsersIdGet**
> apiUsersIdGet()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.apiUsersIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


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

# **apiUsersIdPatch**
> apiUsersIdPatch()


### Example

```typescript
import {
    UserApi,
    Configuration,
    UserForUpdateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let id: string; // (default to undefined)
let userForUpdateDTO: UserForUpdateDTO; // (optional)

const { status, data } = await apiInstance.apiUsersIdPatch(
    id,
    userForUpdateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userForUpdateDTO** | **UserForUpdateDTO**|  | |
| **id** | [**string**] |  | defaults to undefined|


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

# **apiUsersPatch**
> apiUsersPatch()


### Example

```typescript
import {
    UserApi,
    Configuration,
    UserForUpdateDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let userForUpdateDTO: UserForUpdateDTO; // (optional)

const { status, data } = await apiInstance.apiUsersPatch(
    userForUpdateDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userForUpdateDTO** | **UserForUpdateDTO**|  | |


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

# **apiUsersPost**
> apiUsersPost()


### Example

```typescript
import {
    UserApi,
    Configuration,
    UserForCreationDTO
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

let userForCreationDTO: UserForCreationDTO; // (optional)

const { status, data } = await apiInstance.apiUsersPost(
    userForCreationDTO
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userForCreationDTO** | **UserForCreationDTO**|  | |


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

# **apiUsersProfileInfoGet**
> apiUsersProfileInfoGet()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

const { status, data } = await apiInstance.apiUsersProfileInfoGet();
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

# **apiUsersSecuredGet**
> apiUsersSecuredGet()


### Example

```typescript
import {
    UserApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserApi(configuration);

const { status, data } = await apiInstance.apiUsersSecuredGet();
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

