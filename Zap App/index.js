// You'll want to set these with either `CLIENT_ID=abc zapier test` or `zapier env 1.0.0 CLIENT_ID abc`
// process.env.BASE_URL = process.env.BASE_URL || 'https://app.platform.comm100.com';

//process.env.CLIENT_ID = process.env.CLIENT_ID || 'A4F6884D-FBDA-454E-8220-58DB1D816753';
//process.env.CLIENT_SECRET = process.env.CLIENT_SECRET || '6661CBA2-9100-4235-BEBC-7F1AA4BE2044';

/***********BETA FOR app.platform.com **************/
//process.env.CLIENT_ID = process.env.CLIENT_ID || '4d2a31d4-630a-471c-9391-4151f49a1b54';
//process.env.CLIENT_SECRET = process.env.CLIENT_SECRET || 'we2B9GH0cDOc88RWjEGI';
/********************** **************/

/***********BETA FOR TEST **************/
//process.env.CLIENT_ID = process.env.CLIENT_ID || '97957680-C13C-4628-B8B9-0A280A9CED86';
//process.env.CLIENT_SECRET = process.env.CLIENT_SECRET || '29C49FFB-CC40-4A60-B4C5-1846A883DC8B';
/********************** **************/

process.env.OAUTH_HOST = process.env.OAUTH_HOST || "hosted.comm100.com";

const authentication = require('./authentication');
// const authentication = require('./authentication-basic');
// const authentication = require('./authentication-session');
const offlinemessagetrigger = require('./triggers/offlinemessagesubmitted');
const chatstartedtrigger = require('./triggers/chatstarted');
const chatendedtrigger = require('./triggers/chatended');
// const bottrigger = require('./triggers/bothook');
const chatrequest = require('./triggers/chatrequest');
const chatwrapup = require('./triggers/chatwrapup');
const chattransferred = require('./triggers/chattransferred');

// To include the Authorization header on all outbound requests, simply define a function here.
// It runs runs before each request is sent out, allowing you to make tweaks to the request in a centralized spot
const includeBearerToken = (request, z, bundle) => {
  if (bundle.authData.access_token) {
    request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
  }
  return request;
};

const includeBasicToken = (request, z, bundle) => {
  if (bundle.authData.email && bundle.authData.apikey) {
    var b = new Buffer(`${bundle.authData.email}:${bundle.authData.apikey}`);
    var s = b.toString('base64');  
    request.headers.Authorization = `Basic ${s}`;
  }
  return request;
};

// for session type authentication
// If we get a response and it is a 401, we can raise a special error telling Zapier to retry this after another exchange.
const sessionRefreshIf401 = (response, z, bundle) => {
  if (bundle.authData.access_token) {
    if (response.status === 401) {
      bundle.action = 'sessionRefreshIf401';
      //util.postLog(z,response);
      throw new z.errors.RefreshAuthError('Token needs refreshing.');
    }
  }
  return response;
};

// We can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication: authentication,

  beforeRequest: [
    includeBearerToken
    //includeBasicToken
  ],

  afterResponse: [
    // sessionRefreshIf401
  ],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [chatendedtrigger.key]: chatendedtrigger,
    [chatstartedtrigger.key]: chatstartedtrigger,
    [offlinemessagetrigger.key]: offlinemessagetrigger,
   // [bottrigger.key]: bottrigger,
    [chatrequest.key]: chatrequest,
    [chatwrapup.key]: chatwrapup,
    [chattransferred.key]: chattransferred,
  },

  // If you want your searches to show up, you better include it here!
  searches: {
  },

  // If you want your creates to show up, you better include it here!
  creates: {
  }
};

// Finally, export the app.
module.exports = App;
