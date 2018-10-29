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
      domain: domain,
    };
  });  
};

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
  //bundle.action = 'refreshAccessToken';
  //util.postLog(z, bundle);

 // const info = checkUserEmail(z, bundle);
  
  const promise = z.request(`https://${bundle.authData.domain}/oauth/token`, {
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
      throw new Error('Unable to refresh access token: ' + response.content);
    }
    const result = JSON.parse(JSON.stringify(response.json));
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      expires_in: result.expires_in,
      token_type: result.token_type,
      domain: bundle.authData.domain,
    };
  });
};

const testAuth = (z , bundle) => {
  return util.getSample(z, bundle,'chatstarted')
};

const getAuthorizeUrl = async function (z, bundle) {  
  var domain = util.getDomain(bundle);
  let url = `https://${domain}/`;
  await util.checkUrl(z, url)
    .then(code =>{
        if(code == 404) {
        throw new z.errors.HaltedError(`Invalid URL : ${url} .`);
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
      key: 'baseurl', 
      label: 'Base URL', 
      required: false,  
      type: 'string', 
      helpText: 'Optional, change if you have own Comm100 Live Chat Server domain. Such as "mylivechat.com"', 
    }
  ],
  // The test method allows Zapier to verify that the access token is valid. We'll execute this
  // method after the OAuth flow is complete to ensure everything is setup properly.
  test: testAuth,
  // assuming "username" is a key returned from the test
  // connectionLabel: getConnectionLabel
};
