  ### VISITOR INFO JSON FORMAT
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
  | `custom_fields` | array | custom fields |
  | `custom_variables` | array | custom variables |
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
  
  ### Chat INFO JSON FORMAT
  | Name | Type | Description |    
  | - | - | - | 
  | `id` | integer | id of the chat |
  | `name` | string | name of the visitor |
  | `attachment` | array | attachment |
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
  | `custom_fields` | array | custom fields |
  | `custom_variables` | array | custom variables |
  | `product_service` | string | product service |
