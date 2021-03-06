const _subscribeHook = async function(z, bundle, type) {
    const data = {
      targetUrl: bundle.targetUrl,
      event: type,
      zapId: bundle.meta.zap.id,
      zapierAccountId:bundle.authData._zapier_account_id,
    };
   // bundle.action = '_subscribeHook';
   // _postLog(z, bundle);

    const options = {
      url: `https://${bundle.authData.domain}/livechatwebapi/api/v2/livechat/webhooks`,
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
        return response.json;
       });
};
  
const _unsubscribeHook = async function(z, bundle) {    
   //  bundle.action = "_unsubscribeHook";
  //   _postLog(z,bundle);

    const hookId = bundle.subscribeData.id;
  
    const options = {
      url: `https://${bundle.authData.domain}/livechatwebapi/api/v2/livechat/webhooks/${hookId}`,
      method: 'DELETE',
    };
  
    return z.request(options)
      .then((response) => { 
          if (response.status != 200) {
            if(response.json) {
            throw new Error(response.json.Message || response.json.ErrorMessage);
          }else{
            throw new Error('UnSubscribeHook error.');
          }
        }        
          return response.json;
       });
};

const _copyJsonObject = (json) => {
    return JSON.parse(JSON.stringify(json));
};

const _postLog = (z, json) => {
    z.request({
    method: 'POST',
    url: 'https://hooks.zapier.com/hooks/catch/3966530/ed563w/',
    body: json,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((r)=>{});
};

const _checkUrl = (z, url) => {
  const promise = z.request({
    method: 'HEAD',
    url: url
  });
  return promise.then((response) =>{
     return response.status;
  }).catch((reason)=>{
    return 404;
  });
}

function extractHostname(url) {
  var hostname;
  if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }

  //find & remove port number
  // hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

function _getDomain(bundle) {
  if(bundle.inputData.baseurl!= null && bundle.inputData.baseurl.trim() != '') {
    return extractHostname(bundle.inputData.baseurl.trim());
  }else{
    return process.env.OAUTH_HOST;
  }
}

const _getSample = async function(z, bundle, type){
  const options = {
    url: `https://${bundle.authData.domain}/livechatwebapi/api/v2/livechat/zapsamples/${type}`,
    method: 'GET',
  };

  return z.request(options)
    .then((response) =>
      {
        _checkResponse(z, response);
        return response.json;
      }
    );
}

const _checkResponse = (z, response)=>{
  if (response.status != 200) {
    //throw new Error(JSON.stringify(response));
    if(response.status == 401) {
      throw new z.errors.HaltedError('Access Denied: You have no permission for this operation.');        
    }else if(response.json && response.json.Code && (response.json.Code == 4 || response.json.Code == 12 || response.json.Code == 13 || response.json.Code == 403003)){
      throw new z.errors.HaltedError('Access Denied: You have no permission for this operation.');        
    }
    else if(response.json && (response.json.Message || response.json.ErrorMessage)){
      throw new z.errors.HaltedError((response.json.Message || response.json.ErrorMessage));        
    }else{
      throw new z.errors.HaltedError(response.content);        
    }
  }
}

module.exports = {
    subscribe: _subscribeHook,
    unsubscribe: _unsubscribeHook,
    copyJsonObject: _copyJsonObject,
    checkUrl: _checkUrl,
    getSample: _getSample,
    getDomain:_getDomain,
    checkResponse:_checkResponse,
    postLog: _postLog,
};
