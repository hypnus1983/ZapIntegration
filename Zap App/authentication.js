var util = require('./commom/util');

const getAccessToken = (z, bundle) => {
  //bundle.action = 'getAccessToken';
  //util.postLog(z, bundle);
  getAPPAccess(z,bundle);
     
  var domain = "";
  var code = "";
  var infos = unescape(bundle.inputData.code).split("+");
  if(infos.length == 2)
  {
    var domain = infos[0];
    var code = infos[1];
  }else{
     domain = util.getDomain(bundle);
     code = bundle.inputData.code;
  }

  const promise = z.request(`https://${domain}/oauth/token`, {
    method: 'POST',
    body: {
      code: code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: bundle.inputData.redirect_uri
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  });
  return promise.then(async function(response) {
    if (response.status !== 200) {
      throw new z.errors.HaltedError('Unable to fetch access token: ' + response.content);
    }
    const result = response.json;
    await checkPermission(z,domain,result.access_token);
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      token_type: result.token_type,
      expires_in: result.expires_in,
      domain: domain,
    };
  });  
};

const checkPermission = (z, domain, token) =>{
  const options = {
    url: `https://${domain}/livechatwebapi/api/v2/livechat/zapsamples/chatended`,
    method: 'GET',
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  };

  return z.request(options)
    .then((response) =>
      {
        util.checkResponse(z, response);
      }
    );
}

const getAPPAccess = (z, bundle) => {
  //bundle.action = 'getAPPAccess';
  //util.postLog(z, bundle);
  
  var cookies = bundle.rawRequest.headers["Http-Cookie"];
  var csrtoken = getCsrfToken(cookies);  
  const promise = z.request(process.env.INVITEURL, {
    method: 'POST',
    body: {
      confirm: 'yes',
      csrfmiddlewaretoken: csrtoken
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': cookies,
      'Referer': process.env.INVITEURL
    }
  });
  promise.then((response) => {
    //util.postLog(z, response);
  }).catch((error)=>{
    //util.postLog(z, error);
  });
}

const getCsrfToken = (cookies) => {
    var array = cookies.split(";");
    for(var i=0; i< array.length; i++){
       var name = array[i].split("=")[0];
       var value = array[i].split("=")[1];
       if(name.indexOf("token") >0 ) {
      //if(name == "csrftoken") {
          return value;
       }
    }
    return null;
}


const refreshAccessToken = (z, bundle) => { 

 // bundle.action="-- start refreshAccessToken";
 // util.postLog(z,bundle);

  const promise = z.request(`https://${bundle.authData.domain}/oauth/token`, {
    method: 'POST',
    body: {
      refresh_token: bundle.authData.refresh_token,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'refresh_token',
      redirect_uri: bundle.inputData.redirect_uri
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  });

  // Needs to return `access_token`. If the refresh token stays constant, can skip it. If it changes, can
  // return it here to update the user's auth on Zapier.
  return promise.then((response) => {
    if (response.status !== 200) {
     // bundle.action = 'refreshAccessToken error';
     // util.postLog(z, response);
      throw new z.errors.HaltedError('Unable to refresh access token: ' + response.content);
    }
    const result = response.json;
    var r = {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      expires_in: result.expires_in,
      token_type: result.token_type,
      domain: bundle.authData.domain,
    };
    //bundle.action="-- end refreshAccessToken";
    //util.postLog(z,r);
    return r;
  });
};

const testAuth = async function (z , bundle) {
  return await util.getSample(z, bundle,'chatstarted')
};

const getAuthorizeUrl = async function (z, bundle) {  
  var domain = util.getDomain(bundle);
  let url = `https://${domain}/`;
  let testurl = `https://${domain}/OAuth/Login`;
  await util.checkUrl(z, testurl)
    .then(code =>{
        if(code == 404) {
        throw new z.errors.HaltedError(`Invalid URL : ${url} `);
        }
    });
    url += `oauth/authorize?`;
    url += `client_id=${process.env.CLIENT_ID}`;
    url += `&state=${bundle.inputData.state}`;
    url += `&redirect_uri=${bundle.inputData.redirect_uri}`;
    url += `&response_type=code`;
    return url; 
};

const getConnectionLabel = (z, bundle) => {
  const promise = z.request(`https://${bundle.authData.domain}/accountwebapi/api/v2/account/agents/me`);
  // Needs to return `access_token`. If the refresh token stays constant, can skip it. If it changes, can
  // return it here to update the user's auth on Zapier.
  return promise.then((response) => {
    if(response.status == 200 && response.json.displayName) {
      return response.json.displayName;
    }
    return '';
  }).catch((error)=>{
    return '';
  });
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
      key: 'baseurl', 
      label: 'Base URL', 
      required: false,  
      type: 'string', 
      helpText: 'If you use your own Comm100 Live Chat server domain, please fill it out here (example: mylivechat.com). Otherwise, leave blank and hit \'Yes, Continue\ to login.', 
    }
  ],
  // The test method allows Zapier to verify that the access token is valid. We'll execute this
  // method after the OAuth flow is complete to ensure everything is setup properly.
  test: testAuth,
  // assuming "username" is a key returned from the test
   connectionLabel: getConnectionLabel
};
