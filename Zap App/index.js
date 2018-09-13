// You'll want to set these with either `CLIENT_ID=abc zapier test` or `zapier env 1.0.0 CLIENT_ID abc`
process.env.BASE_URL = process.env.BASE_URL || 'https://app.platform.comm100.com';
process.env.CLIENT_ID = process.env.CLIENT_ID || '4d2a31d4-630a-471c-9391-4151f49a1b54';
process.env.SITE_ID = process.env.SITE_ID || '6000018';
process.env.CLIENT_SECRET = process.env.CLIENT_SECRET || 'we2B9GH0cDOc88RWjEGI';
process.env.REDIRECT_URI = process.env.REDIRECT_URI || 'https://localhost';

const authentication = require('./authentication');
const offlinemessagetrigger = require('./triggers/offlinemessagesubmitted');
const chatstartedtrigger = require('./triggers/chatstarted');
const chatendedtrigger = require('./triggers/chatended');


// To include the Authorization header on all outbound requests, simply define a function here.
// It runs runs before each request is sent out, allowing you to make tweaks to the request in a centralized spot
const includeBearerToken = (request, z, bundle) => {
  if (bundle.authData.access_token) {
    request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
  }
  return request;
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
  ],

  afterResponse: [
  ],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [offlinemessagetrigger.key]: offlinemessagetrigger,
    [chatstartedtrigger.key]: chatstartedtrigger,
    [chatendedtrigger.key]: chatendedtrigger
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
