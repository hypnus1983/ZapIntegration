
const _reformatCustomFields = (custom_fields) => {
    if(custom_fields && Array.isArray(custom_fields)) {
       var newFields = {};
       for(var i=0; i<custom_fields.length;i++){
            const field = custom_fields[i];
            newFields[field.name] = {
                name: field.name,
                id: field.id,
                value: field.value
            };
          };
        return newFields; 
     }
     return custom_fields;
  };
  
  const _reformatCustomVariables = (custom_variables) => {
    if(custom_variables && Array.isArray(custom_variables)) {
       var newVariables = {};
       for(var i=0; i<custom_variables.length;i++){
           const variable = custom_variables[i];
           newVariables[variable.name] = {
              name: variable.name,
              value: variable.value
          };
       }
       return newVariables;
    }
    return custom_variables;
  };
  
  const _reformatTranscript = (transcript) => {
    return transcript ? transcript.replace(/⊙/g,'\n') : transcript;
  }
  
  const _reformatDatetime = (datetime) => {
    var str = JSON.stringify(datetime);
    str = str.replace(/[\'\"\\\/\b\f\n\r\t\(\)\/]/g, '');
    str = str.replace(/[a-zA-Z]]/gi,'');
    return str;
  }
  
  const _reformatUri = (uri) => {
    return uri ? uri.replace(/\\\//g,'/') : uri;
  }


  const _reformatVisitorInfo = (visitor) =>{
      if(visitor){
        visitor.current_browsing = _reformatUri(visitor.current_browsing);
        visitor.referrer_url=_reformatUri(visitor.referrer_url);
        visitor.landing_page = _reformatUri(visitor.landing_page);
        visitor.first_visit_time = _reformatDatetime(visitor.first_visit_time);
        visitor.visit_time = _reformatDatetime(visitor.visit_time);        
        visitor.custom_fields = _reformatCustomFields(visitor.custom_fields);
        visitor.custom_variables = _reformatCustomVariables(visitor.custom_variables);
     }
      return visitor;
  }

const _reformatChatInfo = (chat) => {
    if(chat){
        if(chat.attachment) {
            chat.attachment.uri = _reformatUri(chat.attachment.uri);
        }
        chat.chat_transcript = _reformatTranscript(chat.chat_transcript);
        chat.start_time = _reformatDatetime(chat.start_time);
        chat.end_time = _reformatDatetime(chat.end_time);
        if(chat.wrap_up){
            chat.wrap_up = _reformatWrapup(chat.wrap_up);
        }
        chat.custom_fields = _reformatCustomFields(chat.custom_fields);
        chat.custom_variables = _reformatCustomVariables(chat.custom_variables);
    }
    return chat;
}

const _reformatOfflineMessage = (offlinemessage) =>{
    if(offlinemessage){
        offlinemessage.time = _reformatDatetime(offlinemessage.time);
        if(offlinemessage.attachment) {
            offlinemessage.attachment.uri = _reformatUri(offlinemessage.attachment.uri);
        }
        offlinemessage.custom_fields = _reformatCustomFields(offlinemessage.custom_fields);
        offlinemessage.custom_variables = _reformatCustomVariables(offlinemessage.custom_variables);
    }
    return offlinemessage;
}

const _reformatWrapup = (wrapup) => {
    if(wrapup){
        wrapup.fields = _reformatCustomFields(wrapup.fields);
    }
    return wrapup;
}

  module.exports = {
    reformatVisitorInfo:_reformatVisitorInfo,
    reformatChatInfo:_reformatChatInfo,
    reformatOfflineMessage: _reformatOfflineMessage,
    reformatWrapup: _reformatWrapup
};
