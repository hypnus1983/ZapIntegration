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

    var info = await _checkUserEmail(z, bundle)
    .then(response =>{
        return response;
    }); 

    const options = {
      url: `https://${info.domain}/api/v2/livechat/webhooks`,
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
    var info = await _checkUserEmail(z, bundle)
    .then(response =>{
        return response;
    }); 

    const hookId = bundle.subscribeData.webhook.id;
  
    const options = {
      url: `https://${info.domain}/api/v2/livechat/webhooks/${hookId}`,
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


const _checkUserEmail = (z, bundle) => {
  if(bundle.authData.baseurl!= null && bundle.authData.baseurl.trim() != '') {
     const host = extractHostname(bundle.authData.baseurl);
     return Promise.resolve({
       domain: host,
       // siteId: 0,
       siteId: 6000019,  // for test,
       email: bundle.authData.email
     });
  }else{
     const promise =  z.request({
       method: 'POST',
       url: `http://route.comm100.com/routeserver/routeservice.asmx`,
       body: `<?xml version="1.0" encoding="utf-8"?>\r\n<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n  <soap:Body>\r\n    <CheckUserEmail xmlns="http://tempuri.org/">\r\n      <guid>EBB97B32-60FE-4DE9-861E-40D0C2299D54</guid>\r\n      <email>${bundle.authData.email}</email>\r\n    </CheckUserEmail>\r\n  </soap:Body>\r\n</soap:Envelope>`,
       headers: {
         'content-type': 'text/xml',
       }
     });

     return promise.then((response) => {
       var xmlParser = new xml2js.Parser({explicitArray : false, ignoreAttrs : true});
       let info = {};
       xmlParser.parseString(response.content, function (err, parsedResult) {
         if(err) {
           throw new z.errors.HaltedError('Parse XML Error while Check User Email.')
         }
         const result = parsedResult['soap:Envelope']['soap:Body']['CheckUserEmailResponse']['CheckUserEmailResult'];
         const error = result['Error']['_errorString'];
         if(error) {
           throw new z.errors.HaltedError(`Check User Email Error : ${error}.`);
         }
         // util.postLog(z, result);
         const domain = result['PlatformDomain'];
         const siteid = result['SiteId'];
         if(siteid == 0) {
           throw new z.errors.HaltedError('Account Not Found: This email does not exist in the Comm100 account system. ');
         }
         info = {
           domain: domain,
           // siteId: siteid,
           siteId: 6000019,  // for test,
           email: bundle.authData.email,
         };
       });
       return info;
     });
 }
}

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
            throw new Error('SubscribeHook error.');
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
    checkUserEmail: _checkUserEmail,
    checkUrl: _checkUrl,
    getSample: _getSample
};
