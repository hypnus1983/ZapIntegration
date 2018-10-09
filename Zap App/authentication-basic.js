var xml2js = require('xml2js');
var util = require('./commom/util');

const testAuth = async function(z , bundle){
  var b = new Buffer(`${bundle.authData.email}:${bundle.authData.apikey}`);
  var s = b.toString('base64');

  var info = await util.checkUserEmail(z, bundle)
            .then(response =>{
                return response;
            }); 


  var url = `https://${info.domain}/`;
  await checkUrl(z, url)
      .then(code =>{
         if(code == 404) {
          throw new z.errors.HaltedError(`Invalid URL : ${url} .`);
         }
      });

  // Normally you want to make a request to an endpoint that is either specifically designed to test auth, or one that
  // every user will have access to, such as an account or profile endpoint like /me.
  const promise = z.request({
    method: 'GET',
    url: `https://${info.domain}/api/v2/livechat/cannedMessages`,
    // headers: {
    //  'Authorization': `Basic ${s}`
    // }
  });

  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  return promise.then((response) => {
     if (response.status != 200) {
       if(response.json) {
        throw new Error(response.json.Message || response.json.ErrorMessage);
      }else{
        throw new Error('Access is denied due to invalid credentials.');
      }
    }
    return response.json;
  });
};

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


module.exports = {
  type: 'custom',
  // Define any auth fields your app requires here. The user will be prompted to enter this info when
  // they connect their account.
  fields: [
    {
      key: 'email', 
      label: 
      'Email', 
      required: true, 
      type: 'string', 
      helpText: 'The Email login for Comm100 Live Chat.', default: 'zap1@test.com'
    },
    {
      key: 'apikey', 
      label: 
      'API KEY', 
      required: true, 
      type: 'string', 
      helpText: 'Found in your Comm100 Live Chat Settings. [How to get API Key](https://www.comm100.com/livechat/knowledgebase/does-comm100-offer-live-chat-api.html).',
      default: 'cf232bfb65a34861b77d7a7c77ef56a8'
    },
    {
      key: 'baseurl', 
      label: 'Base URL', 
      required: false,  
      type: 'string', 
      helpText: 'Optional, change if you have own Comm100 Live Chat Server domain. Such as "mylivechat.com"', 
      default: 'app.platform.comm100.com'
    },
  ],
  // The test method allows Zapier to verify that the credentials a user provides are valid. We'll execute this
  // method whenver a user connects their account for the first time.
  test: testAuth,
  // assuming "username" is a key in the json returned from testAuth
  connectionLabel: (z, bundle) => {
    return bundle.authData.email;
  }
};
