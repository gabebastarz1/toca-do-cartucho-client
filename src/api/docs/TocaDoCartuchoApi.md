# TocaDoCartuchoApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**forgotPasswordPost**](#forgotpasswordpost) | **POST** /forgotPassword | |
|[**loginPost**](#loginpost) | **POST** /login | |
|[**manage2faPost**](#manage2fapost) | **POST** /manage/2fa | |
|[**manageInfoGet**](#manageinfoget) | **GET** /manage/info | |
|[**manageInfoPost**](#manageinfopost) | **POST** /manage/info | |
|[**mapIdentityApiConfirmEmail**](#mapidentityapiconfirmemail) | **GET** /confirmEmail | |
|[**refreshPost**](#refreshpost) | **POST** /refresh | |
|[**registerPost**](#registerpost) | **POST** /register | |
|[**resendConfirmationEmailPost**](#resendconfirmationemailpost) | **POST** /resendConfirmationEmail | |
|[**resetPasswordPost**](#resetpasswordpost) | **POST** /resetPassword | |

# **forgotPasswordPost**
> forgotPasswordPost(forgotPasswordRequest)


### Example

```typescript
import {
    TocaDoCartuchoApi,
    Configuration,
    ForgotPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TocaDoCartuchoApi(configuration);

let forgotPasswordRequest: ForgotPasswordRequest; //

const { status, data } = await apiInstance.forgotPasswordPost(
    forgotPasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **forgotPasswordRequest** | **ForgotPasswordRequest**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **loginPost**
> AccessTokenResponse loginPost(loginRequest)


### Example

```typescript
import {
    TocaDoCartuchoApi,
    Configuration,
    LoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TocaDoCartuchoApi(configuration);

let loginRequest: LoginRequest; //
let useCookies: boolean; // (optional) (default to undefined)
let useSessionCookies: boolean; // (optional) (default to undefined)

const { status, data } = await apiInstance.loginPost(
    loginRequest,
    useCookies,
    useSessionCookies
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | **LoginRequest**|  | |
| **useCookies** | [**boolean**] |  | (optional) defaults to undefined|
| **useSessionCookies** | [**boolean**] |  | (optional) defaults to undefined|


### Return type

**AccessTokenResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **manage2faPost**
> TwoFactorResponse manage2faPost(twoFactorRequest)


### Example

```typescript
import {
    TocaDoCartuchoApi,
    Configuration,
    TwoFactorRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TocaDoCartuchoApi(configuration);

let twoFactorRequest: TwoFactorRequest; //

const { status, data } = await apiInstance.manage2faPost(
    twoFactorRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **twoFactorRequest** | **TwoFactorRequest**|  | |


### Return type

**TwoFactorResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **manageInfoGet**
> InfoResponse manageInfoGet()


### Example

```typescript
import {
    TocaDoCartuchoApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TocaDoCartuchoApi(configuration);

const { status, data } = await apiInstance.manageInfoGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**InfoResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **manageInfoPost**
> InfoResponse manageInfoPost(infoRequest)


### Example

```typescript
import {
    TocaDoCartuchoApi,
    Configuration,
    InfoRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TocaDoCartuchoApi(configuration);

let infoRequest: InfoRequest; //

const { status, data } = await apiInstance.manageInfoPost(
    infoRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **infoRequest** | **InfoRequest**|  | |


### Return type

**InfoResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json, application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **mapIdentityApiConfirmEmail**
> mapIdentityApiConfirmEmail()


### Example

```typescript
import {
    TocaDoCartuchoApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TocaDoCartuchoApi(configuration);

let userId: string; // (default to undefined)
let code: string; // (default to undefined)
let changedEmail: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.mapIdentityApiConfirmEmail(
    userId,
    code,
    changedEmail
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userId** | [**string**] |  | defaults to undefined|
| **code** | [**string**] |  | defaults to undefined|
| **changedEmail** | [**string**] |  | (optional) defaults to undefined|


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

# **refreshPost**
> AccessTokenResponse refreshPost(refreshRequest)


### Example

```typescript
import {
    TocaDoCartuchoApi,
    Configuration,
    RefreshRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TocaDoCartuchoApi(configuration);

let refreshRequest: RefreshRequest; //

const { status, data } = await apiInstance.refreshPost(
    refreshRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **refreshRequest** | **RefreshRequest**|  | |


### Return type

**AccessTokenResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **registerPost**
> registerPost(registerRequest)


### Example

```typescript
import {
    TocaDoCartuchoApi,
    Configuration,
    RegisterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TocaDoCartuchoApi(configuration);

let registerRequest: RegisterRequest; //

const { status, data } = await apiInstance.registerPost(
    registerRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerRequest** | **RegisterRequest**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resendConfirmationEmailPost**
> resendConfirmationEmailPost(resendConfirmationEmailRequest)


### Example

```typescript
import {
    TocaDoCartuchoApi,
    Configuration,
    ResendConfirmationEmailRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TocaDoCartuchoApi(configuration);

let resendConfirmationEmailRequest: ResendConfirmationEmailRequest; //

const { status, data } = await apiInstance.resendConfirmationEmailPost(
    resendConfirmationEmailRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resendConfirmationEmailRequest** | **ResendConfirmationEmailRequest**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **resetPasswordPost**
> resetPasswordPost(resetPasswordRequest)


### Example

```typescript
import {
    TocaDoCartuchoApi,
    Configuration,
    ResetPasswordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TocaDoCartuchoApi(configuration);

let resetPasswordRequest: ResetPasswordRequest; //

const { status, data } = await apiInstance.resetPasswordPost(
    resetPasswordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **resetPasswordRequest** | **ResetPasswordRequest**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/problem+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

