  ## Zapier Triggers
 - [Chat Request](#chat-request-trigger-json-format) - Triggers when a visitor enters queue. 
 - [New Chat](#new-chat-trigger-json-format)  - Triggers when the chat is started. 
 - [Chat Wrap-up](#chat-wrap-up-trigger-json-format) - Triggers when an agent wrap-up the chat. 
 - [Finished Chat](#finished-chat-trigger-json-format) - Triggers when the chat is ended. 
 - [New Offline Message](#new-offline-message-trigger-json-format) - Triggers when a visitor leaves a message when all agents are offline. 
 - `Chat Transferred` - Triggers when the chat is transferred. 
 - [Bot Webhook](#bot-webhook-trigger-json-format) - Triggers once the Bot reply a visitor question with webhook response. The setting is similar to Webhooks by Zapier. [Examples](https://comm100corp.sharepoint.com/sites/ResearchandDevelopment/_layouts/OneNote.aspx?id=%2Fsites%2FResearchandDevelopment%2FSiteAssets%2FResearch%20and%20Development%20Notebook&wd=target%28Bot%20Research%20-%20Note.one%7CE79C8FEB-BF09-4E58-AF8F-00C8EE4BAEB1%2FBot%20Salesforce%20Integration%20Via%20Zapier%7C9784C339-8781-4A9D-B398-6A01B5233D18%2F%29) 
 
 ---------------------------------------------------------
  ### Chat Request Trigger Json Format
  | Name | Type | Description |    
  | - | - | - | 
  | `event` | string | event type: 'chat_request' |
  | `visitor` | [Visitor](#visitor-info-json-format) | visitor info |
  
  ### New Chat Trigger Json Format
  | Name | Type | Description |    
  | - | - | - | 
  | `event` | string | event type: 'chat_started' |
  | `visitor` | [Visitor](#visitor-info-json-format) | visitor info |
 
  ### Finished Chat Trigger Json Format
  | Name | Type | Description |    
  | - | - | - | 
  | `event` | string | event type: 'chat_ended' |
  | `visitor` | [Visitor](#visitor-info-json-format) | visitor info |
  | `chat` | [Chat](#chat-info-json-format) | chat info |
  
   ### New Offline Message Trigger Json Format
  | Name | Type | Description |    
  | - | - | - | 
  | `event` | string | event type: 'offline_message_submitted' |
  | `offline_message` | [Offline Message](#offline-message-json-format) | offline message info |
  | `visitor` | [Visitor](#visitor-info-json-format) | visitor info |
  
  ### Chat Wrap up Trigger Json Format
  | Name | Type | Description |    
  | - | - | - | 
  | `event` | string | event type: 'chat_wraped_up' |
  | `chat_id` | integer | id of the chat  |
  | `visitor` | [Visitor](#visitor-info-json-format) | chat info | 
  | `wrapup` | [Wrapup](#wrapup-json-format) | chat info | 
  
  ### Bot WebHook Trigger Json Format
  | Name | Type | Description |    
  | - | - | - | 
  | `senderType` | integer | sender type |
  | `senderId` | integer | sender id  |
  | `formValues` | array | formValues |
  | `questionId` | string | question id  |
  | `intentId` | integer | intent id  |
  | `botId` | integer | bot id  |
  | `chatId` | integer | id of the chat  |
  | `visitor` | [Visitor](#visitor-info-json-format) | chat info |  
  
  -----------------------------------------------------------------
 
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
  | `first_visit_time` | integer | first visit time (1536738453010) |
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
  | `visit_time` | integer | visit time (1536738453010)|
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
  | `start_time` | integer | chat started time (1536738453010) |
  | `end_time` | integer | chat ended time (1536738453010) |
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
  | `time` | integer | message created time (1536742958450) |        
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
  | `time` | integer | wrap up time (1536742958450) |
  
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
