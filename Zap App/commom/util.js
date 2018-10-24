var xml2js = require('xml2js');

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
        //return response.json;
        return 
        {
           webhook:response.json
        };
       });
};
  
const _unsubscribeHook = async function(z, bundle) { 
    const hookId = bundle.subscribeData.webhook.id;
  
    const options = {
      url: `https://${bundle.authData}/api/v2/livechat/webhooks/${hookId}`,
      method: 'DELETE',
    };
  
    return z.request(options)
      .then((response) => response.content);
};

const _copyJsonObject = (json) => {
    return JSON.parse(JSON.stringify(json));
};

const _postLog = (z, json) => {
   console.log(json);
   /* z.request({
    method: 'POST',
    url: `https://hooks.zapier.com/hooks/catch/3763044/lbf0z0/`,
    body: json,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((r)=>{}); */
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
  if(bundle.authData.baseurl!= null && bundle.authData.baseurl.trim() != '') {
    return extractHostname(bundle.authData.baseurl);
  }else{
    return process.env.OAUTH_HOST;
  }
}

const _getSample = async function(z, bundle, type){
  var info = await _checkUserEmail(z, bundle)
            .then(response =>{
                return response;
            });

  const options = {
    url: `https://${info.domain}/api/v2/livechat/zapsamples/${type}`,
    method: 'GET',
  };

  return z.request(options)
    .then((response) =>
      {
        if (response.status != 200) {
          if(response.json) {
            throw new Error(response.json.Message || response.json.ErrorMessage);
          }else{
            throw new Error(`getSample error.(${response.status})`);
          }
        }
        return response.json;
      }
    );
}

module.exports = {
    subscribe: _subscribeHook,
    unsubscribe: _unsubscribeHook,
    copyJsonObject: _copyJsonObject,
    postLog: _postLog,
    checkUrl: _checkUrl,
    getSample: _getSample,
    getDomain:_getDomain
};
