# Zapier 设计文档



## 1. 数据库设计

- General库内新增表 `t_LiveChat_ZapTemplate`

  | Seq  | Name             | Type           | Nullable | Default | Version | Remark                                     |
  | ---- | ---------------- | -------------- | -------- | ------- | ------- | ------------------------------------------ |
  | 1    | Id               | int            | no       | 0       | 1.0     | Id of the zap template.                    |
  | 2    | Summary          | nvarchar(2048) | no       | ''      | 1.0     | Summary of the zap template.               |
  | 3    | AppName          | nvarchar(128)  | no       | ''      | 1.0     | Name of APP.                               |
  | 4    | AppIcon          | Image          | no       | 0x00    | 1.0     | Icon data of the APP.                      |
  | 5    | Link             | nvarchar(512)  | no       | ''      | 1.0     | Link of the template                       |
  | 6    | IfShownByDefault | bit            | no       | 0       | 1.0     | Is the template  shown in list by default. |
  | 7    | SortOrder        | int            | no       | 0       | 1.0     | Sort order of the template.                |

- 表t_LiveChat_Webhook新增一列ZapId.

| Seq  | Name             | Type           | Nullable | Default | Version | Remark                                       |
| ---- | ---------------- | -------------- | -------- | ------- | ------- | -------------------------------------------- |
| 1    | Id               | int            | no       |         |         |                                              |
| 2    | SiteId           | int            | no       |         |         |                                              |
| 3    | EnumWebhookEvent | int            | no       |         |         |                                              |
| 4    | TargetUrl        | nvarchar(2048) | no       |         |         |                                              |
| 5    | RowVersion       | timestamp      | no       |         |         |                                              |
| 6    | IfDeleted        | bit            | no       |         |         |                                              |
| 7    | ZapId            | int            | no       | 0       | 1.0     | Id of the Zap which subscribed this webhook. |



- 表**t_OAuth_Client **需用脚本插入1条数据，**Secret**和**ClientId**用于ZapAPP端的OAuth认证, 需要预置在APP内。**RedirectUris**为APP的地址。

```mssql
 Insert INTO t_OAuth_Client 
 	([Name]
 	,[Secret]
 	,[Scopes]
 	,[GrantTypes]
 	,[RedirectUris]
 	,[AccessTokenValidity]
 	,[RefreshTokenValidity]
 	,[IfTrusted]
 	,[IfActived]
 	,[CreateTime]
 	,[ClientId]
 	,[OwnerId]
 	,[OwnerType])
 	VALUES
 	(
 	 'ZapAppClient',
 	 '95ABC840-53B4-42D2-AB48-35655E79E914',
     'any',
      1.2,
      'https://zapier.com/dashboard/auth/oauth/return/App6439CLIAPI/',
      12,
      720,
      0,
      1,
      getdate(),
      '6DBADD8D-6FCF-45B6-ABC9-3DDE35C02A8B',
      0,
      'Partner'  
 	)
```



## 2. 程序设计

### 2.1 LiveChat修改

- EnumWebhookEvent枚举增加 **enumChatRequestd**, **enumChatTransferred** 2项：

  ```c#
  namespace Com.Comm100.LiveChat.Framework.Emum
  {
  	public enum EnumWebhookEvent 
      {
          enumOfflineMessageSubmitted =1;
          enumChatStarts = 2;
          enumChatEnds = 3;
          enumChatWrapup = 4;
          enumOperatorEventNotification = 5;
          enumChatRequestd = 6;
          enumChatTransferred  = 7
      }
  }
  ```

### 2.2 LiveChatWebAPI修改

LiveChatWebAPI原Webhook的`Create New Webhook`接口修改，WebHook Json Format内增加ZapId字段，且event新增支持`chatrequested`,`chattransferred`.

- `WebHooks` - WebHooks Manage
  - `POST /api/v2/livechat/webhooks` -Create a new webhooks

###### webhook json format

| Name      | Type    | Read-only | Mandatory | Description                                                  |
| --------- | ------- | --------- | --------- | ------------------------------------------------------------ |
| id        | integer | yes       | no        | id of webhook                                                |
| event     | string  | no        | yes       | event of webhook,including `offlineMessageSubmitted`, `chatStarted`, `chatEnded`,`chatWrapedUp`,`chatRequested`,`chatTransferred` |
| targetUrl | string  | no        | yes       | target url of the webhook.                                   |
| zapId     | integer | no        | no        | id of the Zap.                                               |

###### Endpoint

`POST /api/v2/livechat/webhooks`

- Parameters: [Webhook](#webhook-json-format)

- Response: [Webhook](#webhook-json-format)

   

LiveChatWebAPI新增以下接口。这些接口主要用于用户生成Zap时APP需要通过该API拉取一个Sample Data来做之后的字段映射配置。

所有接口都要求Operator有Manage Integration权限，否则报`No Permission` 错误。 在APP端的权限验证也会调用这些接口进行权限测试。

- `ZapSamples` - Zap Samples Manage

  + `GET /api/v2/livechat/zapsamples/chatrequestd`- Get a sample data for  Chat Requestd trigger

  - `GET /api/v2/livechat/zapsamples/chatstarts`- Get a sample data for Chat Started trigger

  - `GET /api/v2/livechat/zapsamples/chatends`- Get a sample data for Chat Ended trigger

  - `GET /api/v2/livechat/zapsamples/OfflineMessageSubmitted` - Get a sample data for  OfflineMessageSubmitted trigger

  - `GET /api/v2/livechat/zapsamples/chatwrapup`- Get a sample data for  Chat Wrapped Up trigger

  - `GET /api/v2/livechat/zapsamples/chattransferred`- Get a sample data for  Chat Transferred trigger


##### 2.2.1 Get Chat Requestd Sample

###### Chat Requestd Json Format

| Name      | Type                                 | Description                |
| --------- | ------------------------------------ | -------------------------- |
| `event`   | string                               | event type: 'chat_request' |
| `visitor` | [Visitor](#visitor-info-json-format) | visitor info               |

###### Endpoint

`GET /api/v2/livechat/zapsamples/chatrequest` 

- Parameters: No parameters
- Response:  [Chat Requestd](#chat-requestd-json-format) 



#####  2.2.2 Get Chat Started Sample

###### Chat Started Json Format

| Name      | Type                                 | Description                |
| --------- | ------------------------------------ | -------------------------- |
| `event`   | string                               | event type: 'chat_started' |
| `visitor` | [Visitor](#visitor-info-json-format) | visitor info               |

###### Endpoint

`GET /api/v2/livechat/zapsamples/chatstarts`

- Parameters: No parameters
- Response: [Chat Started](#chat-started-json-format)



##### 2.2.3  Get  Chat Ended Sample

###### Chat Ended Json Format

| Name      | Type                                 | Description              |
| --------- | ------------------------------------ | ------------------------ |
| `event`   | string                               | event type: 'chat_ended' |
| `visitor` | [Visitor](#visitor-info-json-format) | visitor info             |
| `chat`    | [Chat](#chat-info-json-format)       | chat info                |

###### Endpoint

`GET /api/v2/livechat/zapsamples/chatends`

- Parameters : No Parameters
- Response: [Chat Ended](#chat-ended-json-format)



##### 2.2.4 Get Offline Message Sample

###### Offline Message Json Format

| Name              | Type                                            | Description                             |
| ----------------- | ----------------------------------------------- | --------------------------------------- |
| `event`           | string                                          | event type: 'offline_message_submitted' |
| `offline_message` | [Offline Message](#offline-message-json-format) | offline message info                    |
| `visitor`         | [Visitor](#visitor-info-json-format)            | visitor info                            |

###### Endpoint

`GET /api/v2/livechat/zapsamples/OfflineMessageSubmitted`

- Parameter: No parameters

- Response: [Offline Message](#offline-message-json-format)


##### 2.2.5 Get Chat Transferred Sample

###### Chat Transferred Json Format

| Name      | Type                                 | Description                    |
| --------- | ------------------------------------ | ------------------------------ |
| `event`   | string                               | event type: 'chat_transferred' |
| `visitor` | [Visitor](#visitor-info-json-format) | visitor info                   |
| `chat`    | [Chat](#chat-info-json-format)       | chat info                      |

###### Endpoint

`GET /api/v2/livechat/zapsamples/Chattransferred`

- Parameters : No Parameters
- Response: [Chat Transferred](#chat-transferred-json-format)



##### 2.2.6 Get Chat Wrapped Up Sample

###### Chat Wrapped Up Json Format

| Name      | Type                                 | Description                  |
| --------- | ------------------------------------ | ---------------------------- |
| `event`   | string                               | event type: 'chat_wraped_up' |
| `chat_id` | integer                              | id of the chat               |
| `visitor` | [Visitor](#visitor-info-json-format) | chat info                    |
| `wrapup`  | [Wrapup](#wrapup-json-format)        | chat info                    |

###### Endpoint

`GET /api/v2/livechat/zapsamples/chatwrapup`

- Parameters : No Parameters
- Response: [Chat Wrapped Up](#chat-wrapped-up-json-format)



### 参考字段

#### Visitor Info Json Format
| Name | Type | Description |
| - | - | - |
| `id` | integer | id of the visitor |
| `name` | string | name of the visitor |
| `chat_id` | integer | id of the chat |
| `ip` | string | ip of the visitor |
| `chats` | integer | number of chats |
| `city` | string | city info |
| `company` | string | company info |
| `country` | string | country info |
| `current_browsing` | string | currnet browsing page url |
| `custom_fields` | array of [Custom Field](#custom-field-json-format) | custom fields |
| `custom_variables` | array of [Custom Variable](#custom-variable-json-format) | custom variables |
| `department` | integer | department id |
| `email` | string | visitor's email address |
| `phone` | string | phone number of visitor |
| `first_visit_time` | integer | first visit time (unix timestamp) |
| `keywords` | string | keywords |
| `browser` | string | browser info, ect.  Google Chrome 68.0.3440.106 |
| `landing_page` | string | landing page url |
| `language` | string | language info |
| `operating_system` | string | operating system info |
| `page_views` | integer | page views |
| `product_service` | string | product service |
| `referrer_url` | string | referrerurl |
| `screen_resolution` | string | screen resolution |
| `search_engine` | string | search engine |
| `state` | string | state info |
| `status` | integer | status |
| `time_zone` | string | time zone |
| `visit_time` | integer | visit time (unix timestamp) |
| `visits` | integer | visit times|

#### Chat Info Json Format
| Name | Type | Description |
| - | - | - |
| `id` | integer | id of the chat |
| `name` | string | name of the visitor |
| `attachment` | [Attachment](#attachment-json-format) | attachment |
| `chat_transcript` | string | chat's transcript |
| `company` | string | company info of visitor |
| `department` | integer | visitor's department id |
| `email` | string | visitor's email address |
| `phone` | string | phone number of visitor |
| `start_time` | integer | chat started time (unix timestamp) |
| `end_time` | integer | chat ended time (unix timestamp) |
| `waiting_time` | string | waiting time (such as: '6s') |
| `operator_comment` | string | operator's comment |
| `operators` | string | operators's name |
| `rating` | integer | rating value |
| `rating_comment` | string | rating's comment |
| `wrap_up` | object | wrap up info |
| `custom_fields` | array of [Custom Field](#custom-field-json-format) | custom fields |
| `custom_variables` | array of [Custom Variable](#custom-variable-json-format) | custom variables |
| `product_service` | string | product service |


#### Offline Message Json Format
| Name | Type | Description |
| - | - | - |
| `id` | integer | id of the offline message |
| `name` | string | name of the visitor |
| `phone` | string | phone number of visitor |
| `email` | string | visitor's email address |
| `company` | string | company info of visitor |
| `department` | integer | visitor's department id |
| `subject` | string | message subject |
| `time` | integer | message created time (unix timestamp) |
| `attachment` | [Attachment](#attachment-json-format) | attachment |
| `content` | string | message content |
| `custom_fields` | array of [Custom Field](#custom-field-json-format) | custom fields |
| `custom_variables` | array of [Custom Variable](#custom-variable-json-format) | custom variables |

#### Wrapup Json Format
| Name | Type | Description |
| - | - | - |
| `category` | string | category of the wrapup |
| `comment` | string | comment of the wrapup |
| `fields` | Array of [Field](#field-json-format) | fields of wrapup |
| `time` | integer | wrap up time (unix timestamp) |

#### Custom Field Json Format
| Name | Type | Description |
| - | - | - |
| `id` | integer | id of the custom field |
| `name` | string | name of the custom field |
| `value` | string | value of the custom field|

  #### Custom Variable Json Format
| Name | Type | Description |
| - | - | - |
| `name` | string | name of the custom variable |
| `value` | string | value of the custom variable|

  #### Attachment Json Format
| Name | Type | Description |
| - | - | - |
| `name` | string | name of the attachment |
| `uri` | string | uri of the attachment|

  #### Field Json Format
| Name | Type | Description |
| - | - | - |
| `id` | integer | id of the field |
| `name` | string | name of the field |
| `value` | string | value of the field|

  #### CollectedValues Json Format
| Name | Type | Description |
| - | - | - |
| `lable` | string | lable of the form |
| `value` | string | value of the form|
