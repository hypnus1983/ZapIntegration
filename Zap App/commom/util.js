const _subscribeHook = (z, bundle, type) => {
    const data = {
      targetUrl: bundle.targetUrl,
      event: type,
     // siteId: bundle.authData.siteId,
     // email: bundle.authData.email,
     // domain: bundle.authData.domain,
      zapId: bundle.meta.zap.id,
      zapierAccountId:bundle.authData._zapier_account_id,
     // raw: bundle
    };
    bundle.action = '_subscribeHook';
    _postLog(z, bundle);

    const options = {
      url: `https://${bundle.authData.domain}/api/v2/livechat/webhooks`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    return z.request(options)
      .then((response) => { 
          if (response.status != 200) {
            if(response.json) {
            throw new Error(response.json.Message || response.json.ErrorMessage);
          }else{
            throw new Error('SubscribeHook error.');
          }
        }
        return JSON.parse(response.content);
       });
};
  
const _unsubscribeHook = (z, bundle) => {
  bundle.action = '_unsubscribeHook';
  _postLog(z, bundle);

    const hookId = bundle.subscribeData.id;
  
    const options = {
      url: `https://${bundle.authData.domain}/api/v2/livechat/webhooks/${hookId}`,
      method: 'DELETE',
    };
  
    return z.request(options)
      .then((response) => response.content);
};

const _copyJsonObject = (json) => {
    return JSON.parse(JSON.stringify(json));
};

const _postLog = (z, json) => {
   z.request({
    method: 'POST',
    url: `https://hooks.zapier.com/hooks/catch/3763044/lbf0z0/`,
    body: json,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((r)=>{});
};

const _reformatCustomFields = (json) => {
  if(json && json.custom_fields && Array.isArray(json.custom_fields)) {
     var newFields = {};
     for(var i=0; i<json.custom_fields.length;i++){
          const field = json.custom_fields[i];
          newFields[field.name] = {
            id: field.id,
            value: field.value
          };
        };
      json.custom_fields = newFields; 
   }
   return json;
};

const _reformatCustomVariables = (json) => {
  if(json && json.custom_variables && Array.isArray(json.custom_variables)) {
     var newVariables = {};
     for(var i=0; i<json.custom_variables.length;i++){
         const variable = json.custom_variables[i];
         newVariables[variable.name] = {
         'value': variable.value
        };
     }
     json.custom_variables = newVariables;
  }
  return json;
};

module.exports = {
    subscribe: _subscribeHook,
    unsubscribe: _unsubscribeHook,
    copyJsonObject: _copyJsonObject,
    postLog: _postLog,
    reformatCustomFields: _reformatCustomFields,
    reformatCustomVariables: _reformatCustomVariables
};
