const sample = require('../samples/offlinemessage_sample.json');
const util = require('../commom/util');
const helper = require('../commom/jsonhelper');

const subscribeHook = (z, bundle) => { 
  return util.subscribe(z, bundle, 'offlinemessagesubmitted')
};

const unsubscribeHook = (z, bundle) => {
  return util.unsubscribe(z, bundle)
};

const getOfflineMessage = (z, bundle) => {

  const recipe = bundle.cleanedRequest;

  return [recipe];
};

const getFallbackRealOfflineMessage = (z, bundle) => {
  var sample = util.getSample('offlinemessagesubmitted');
   const json = reformat(sample);
   return [json];
};

const reformat = (json) => {
  json.visitor = helper.reformatVisitorInfo(json.visitor);
  json.offline_message = helper.reformatOfflineMessage(json.offline_message);
  return json;
}

// We recommend writing your triggers separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'offline_message_submitted',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'offline message',
  display: {
    label: 'Offline Message Submitted',
    description: 'Trigger when a visitor leaves a message when all agents are offline.'
  },

  // `operation` is where the business logic goes.
  operation: {

    // `inputFields` can define the fields a user could provide,
    // we'll pass them in as `bundle.inputData` later.
    /* inputFields: [
      {key: 'style', type: 'string', helpText: 'Which styles of cuisine this should trigger on.'}
    ], */

    type: 'hook',

    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,

    perform: getOfflineMessage,
    performList: getFallbackRealOfflineMessage,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: sample,

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    /* outputFields: [
      {key: 'offline_message', label: 'Offline Message'},
      {key: 'visitor', label: 'Visitor Info'},
      {key: 'event', label: 'Event Type'},
      {key: 'offline_message content', label: 'Offline Message Content'},
      {key: 'offline_message email', label: 'Visitor\'s Email'},
      {key: 'offline_message name', label: 'Visitor\' Name'},
      {key: 'offline_message phone', label: 'Visitor\' Phone Number'},
      {key: 'visitor email', label: 'Visitor\'s Email'},
      {key: 'visitor name', label: 'Visitor\'s Name'},
      {key: 'visitor country', label: 'Visitor\'s Country'},
      {key: 'visitor city', label: 'Visitor\'s City'},
    ] */
  }
};
