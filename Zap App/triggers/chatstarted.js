const sample = require('../samples/chatstarted_sample.json');
const util = require('../commom/util');

const subscribeHook = (z, bundle) => { 
  return util.subscribe(z, bundle, 'chatStarted')
};

const unsubscribeHook = (z, bundle) => {
  return util.unsubscribe(z, bundle)
};

const getChatStarted = (z, bundle) => {

  const recipe = bundle.cleanedRequest;

  return [recipe];
};

const getFallbackRealChatStarted = (z, bundle) => {    
   const json = sample;
   return [json];
};


// We recommend writing your triggers separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'chat_started',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Chat Started',
  display: {
    label: 'Chat Started',
    description: 'Trigger when a new chat is started.'
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

    perform: getChatStarted,
    performList: getFallbackRealChatStarted,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: sample,

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    /*outputFields: [
      {key: 'event', label: 'Event Type'},
      {key: 'visitor', label: 'Visitor Info'},
      {key: 'visitor email', label: 'Visitor\'s Email'},
      {key: 'visitor name', label: 'Visitor\'s Name'},
      {key: 'visitor country', label: 'Visitor\'s Country'},
      {key: 'visitor city', label: 'Visitor\'s City'},
      {key: 'visitor chat_id', label: 'Chat Id'},
    ]*/
  }
};
