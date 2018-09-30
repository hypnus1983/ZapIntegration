var xml2js = require('xml2js');
var util = require('./commom/util');

const getAccessToken = (z, bundle) => {
  bundle.action = 'getAccessToken';
  util.postLog(z, bundle);

  return checkUserEmail(z, bundle).then((info) => {   
    const promise = z.request(`https://${info.domain}/OAuthServer/oauth/token`, {
      method: 'POST',
      body: {
        code: bundle.inputData.code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        siteId: info.siteId,
        // email: info.email,
        redirect_uri: bundle.inputData.redirect_uri
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    });
    return promise.then((response) => {
      if (response.status !== 200) {
        throw new Error('Unable to fetch access token: ' + response.content);
      }
      const result = z.JSON.parse(z.JSON.stringify(response.json));
      return {
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        token_type: result.token_type,
        expires_in: result.expires_in,
        siteId: info.siteId,
        email: info.email,
        domain: info.domain,
      };
    });  
  });
};

const refreshAccessToken = (z, bundle) => {
  bundle.action = 'refreshAccessToken';
  util.postLog(z, bundle);

 // const info = checkUserEmail(z, bundle);
  
  const promise = z.request(`https://${bundle.authData.domain}/OAuthServer/oauth/token`, {
    method: 'POST',
    body: {
      refresh_token: bundle.authData.refresh_token,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'refresh_token'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  });

  // Needs to return `access_token`. If the refresh token stays constant, can skip it. If it changes, can
  // return it here to update the user's auth on Zapier.
  return promise.then((response) => {
    if (response.status !== 200) {
      throw new Error('Unable to fetch access token: ' + response.content);
    }
    const result = JSON.parse(JSON.stringify(response.json));
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      expires_in: result.expires_in,
      token_type: result.token_type,
      siteId: bundle.authData.siteId,
      email: bundle.authData.email,
      domain: bundle.authData.domain,
    };
  });
};

const testAuth = (z , bundle) => {
  bundle.action = 'testAuth';
 // util.postLog(z, bundle);

  // Normally you want to make a request to an endpoint that is either specifically designed to test auth, or one that
  // every user will have access to, such as an account or profile endpoint like /me.
  const promise = z.request({
    method: 'GET',
    url: `https://${bundle.authData.domain}/api/v2/livechat/cannedMessages`,
    headers: {
      'Authorization': `bearer ${bundle.authData.access_token}`
    }
  });

  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  return promise.then((response) => {
    //console.log(response);
    // util.postLog(z, response.json);
     if (response.status != 200) {
       if(response.json) {
        throw new Error(response.json.Message || response.json.ErrorMessage);
      }else{
        throw new Error('The access token you supplied is not valid');
      }
    }
    const result = JSON.parse(JSON.stringify(response.json));
  });
};

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

const checkUserEmail = (z, bundle) => {
   if(bundle.inputData.baseurl!= null && bundle.inputData.baseurl.trim() != '') {
      const host = extractHostname(bundle.inputData.baseurl);
      return Promise.resolve({
        domain: host,
        // siteId: 0,
        siteId: 6000019,  // for test,
        email: bundle.inputData.email
      });
   }else{
      const promise =  z.request({
        method: 'POST',
        url: `http://route.comm100.com/routeserver/routeservice.asmx`,
        body: `<?xml version="1.0" encoding="utf-8"?>\r\n<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\r\n  <soap:Body>\r\n    <CheckUserEmail xmlns="http://tempuri.org/">\r\n      <guid>EBB97B32-60FE-4DE9-861E-40D0C2299D54</guid>\r\n      <email>${bundle.inputData.email}</email>\r\n    </CheckUserEmail>\r\n  </soap:Body>\r\n</soap:Envelope>`,
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
            throw new z.errors.HaltedError('Check User Email Error : Site id returnd 0. Make sure the email exists.');
          }
          info = {
            domain: domain,
            // siteId: siteid,
            siteId: 6000019,  // for test,
            email: bundle.inputData.email,
          };
        });
        return info;
      });
  }
}

const checkUrl = (z, url) => {
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

const getAuthorizeUrl = (z, bundle) => {  
  return checkUserEmail(z, bundle).then((info) => {
    let url = `https://${info.domain}/`;
    return checkUrl(z, url)
      .then(code =>{
         if(code == 404) {
          throw new z.errors.HaltedError(`Invalide URL : ${url}.`);
        }
        url += `OAuthServer/oauth/authorize?`;
        url += `client_id=${process.env.CLIENT_ID}`;
        url += `&state=${bundle.inputData.state}`;
        url += `&redirect_uri=${bundle.inputData.redirect_uri}`;
        url += `&siteId=${info.siteId}`
        url += `&response_type=code`;
        url += `&email=${bundle.inputData.email}`;
        return url; 
      });
  });
};

const getConnectionLabel = (z, bundle) => {
  return `${bundle.authData.email}`;
}

module.exports = {
  type: 'oauth2',
  oauth2Config: {
    authorizeUrl: getAuthorizeUrl,

    // Step 2 of the OAuth flow; Exchange a code for an access token.
    // This could also use the request shorthand.
    getAccessToken: getAccessToken,
    // (Optional) If the access token expires after a pre-defined amount of time, you can implement
    // this method to tell Zapier how to refresh it.
    refreshAccessToken: refreshAccessToken,
    // If you want Zapier to automatically invoke `refreshAccessToken` on a 401 response, set to true
    autoRefresh: true
    // If there is a specific scope you want to limit your Zapier app to, you can define it here.
    // Will get passed along to the authorizeUrl
    // scope: 'read,write'
  },
  fields: [
    {
      key: 'email', 
      label: 
      'Email', 
      required: true, 
      type: 'string', 
      helpText: 'The Email login for Comm100 Live Chat.', default: 'vincent@comm300.com'
    },
    {
      key: 'baseurl', 
      label: 'Base URL', 
      required: false,  
      type: 'string', 
      helpText: 'Optional, change if you have own Comm100 Live Chat Server domain. Such as "mylivechat.com"', 
      default: 'app.platform.comm100.com'
      //inputFormat: 'https://{{input}}.yourdomain.com'
    },
  ],
  // The test method allows Zapier to verify that the access token is valid. We'll execute this
  // method after the OAuth flow is complete to ensure everything is setup properly.
  test: testAuth,
  // assuming "username" is a key returned from the test
  connectionLabel: getConnectionLabel
};
