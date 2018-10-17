var util = require('./commom/util');

const testAuth = async function(z , bundle) {
  var info = await util.checkUserEmail(z, bundle)
  .then(response =>{
      return response;
  }); 
  var url = `https://${info.domain}/`;
  
  // Normally you want to make a request to an endpoint that is either specifically designed to test auth, or one that
  // every user will have access to, such as an account or profile endpoint like /me.
  // In this example, we'll hit httpbin, which validates the Authorization Header against the arguments passed in the URL path
  const promise = z.request({
    url: url,
    method: 'GET',
    timeout: 3 * 60 * 1000
  });

  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  return promise.then((response) => {
    if (response.status != 200) {
      if(response.status == 403) {
       throw z.errors.HaltedError('Access Denied: You have no permission for this operation.');
     }else if(response.json && (response.ErrorMessage || response.Message))
     {
      throw z.errors.HaltedError(response.ErrorMessage || response.Message);
     }
     else{
       throw z.errors.HaltedError(`Access is denied (status=${response.status})`);
     }
   }
   return response.json;
 }).catch(function(error) {
  throw new z.errors.HaltedError((z.JSON.stringify(error)));
  });
};

const getSessionKey = async function(z, bundle) {
  //bundle.action = 'getSessionKey';
  //util.postLog(z,bundle);

  let info = {};
  if(bundle.authData.siteId) {
     info = {
      domain: bundle.authData.domain,
      siteId: bundle.authData.siteId,
      email: bundle.authData.email,
     }
  }else{
     info = await util.checkUserEmail(z, bundle)
                        .then(response =>{
                          return response;
                      }); 
  }
  // const promise =  bundle.authData.refresh_token ? refreshToken(z,bundle) : getToken(z,bundle,info);  
  const promise = getToken(z,bundle,info);
  return promise.then((response) => {
    if (response.status === 401 || response.status === 403) {
      throw new z.errors.HaltedError('Authentication Failed: The password is incorrect.');
    }
    //bundle.authData.password = null;
    const json = response.json;
    return {
      domain: info.domain,
      siteId: info.siteId,
      email: info.email,
      access_token: json.access_token || '',
      refresh_token: json.refresh_token || '',
      expires_in: json.expires_in || 0,
      token_type: json.token_type || ''
    };
  }).catch(function(error) {
    throw new z.errors.HaltedError((z.JSON.stringify(error)));
  });
};

const getToken = async function(z, bundle,info) {
  var url = `https://${info.domain}/`;
  await util.checkUrl(z, url)
      .then(code =>{
         if(code == 404) {
          throw new z.errors.HaltedError(`Invalid URL : ${url} `);
         }
      });

  return promise = z.request({
    method: 'POST',
    url: `https://${info.domain}/partner/oauth/token`,
    body: {
      email: bundle.authData.email,
      password: bundle.authData.password,
      grant_type: 'password'
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 60 * 1000
  });
}

const refreshToken = async function(z, bundle) {
  var url = `https://${bundle.authData.domain}/`;
  return promise = z.request({
    method: 'POST',
    url: `https://${info.domain}/partner/oauth/token`,
    body: {
      grant_type: 'refresh_token',
      refresh_token: bundle.authData.refresh_token
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 60 * 1000
  });
}

module.exports = {
  type: 'session',
  // Define any auth fields your app requires here. The user will be prompted to enter this info when
  // they connect their account.
  fields: [
    {
      key: 'email', 
      label: 'Email', 
      required: true, 
      type: 'string', 
      helpText: 'The email login for Comm100 Live Chat.', default: 'lizzzhang2017@gmail.com'
    },
    {
      key: 'password', 
      label: 'Password', 
      required: true, 
      type: 'password', 
      helpText: 'The password login for Comm100 Live Chat.', default: '111111',
      default: 'cf232bfb65a34861b77d7a7c77ef56a8'
    },
    {
      key: 'baseurl', 
      label: 'Base URL', 
      required: false,  
      type: 'string', 
      helpText: 'If you use your own Comm100 Live Chat server domain, please fill it out here. Example: mylivechat.com', 
      default: 'app.platform.comm100.com'
    },
  ],
  // The test method allows Zapier to verify that the credentials a user provides are valid. We'll execute this
  // method whenver a user connects their account for the first time.
  test: testAuth,
  // The method that will exchange the fields provided by the user for session credentials.
  sessionConfig: {
    perform: getSessionKey
  },
  // assuming "username" is a key returned from the test
  connectionLabel: (z, bundle) => {
    return bundle.authData.email;
  }
};
