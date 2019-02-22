const sample = require('../samples/chatstarted_sample.json');
const util = require('../commom/util');
const helper = require('../commom/jsonhelper');

const subscribeHook = (z, bundle) => { 
  return util.subscribe(z, bundle, 'chatStarted')
};

const unsubscribeHook = (z, bundle) => {
  return util.unsubscribe(z, bundle)
};

const getChatStarted = (z, bundle) => {
  const recipe = reformat(bundle.cleanedRequest);
  return [recipe];
};

const getFallbackRealChatStarted = async function(z, bundle) {     
  var sample = await util.getSample(z, bundle,'chatstarted');
  const json = reformat(sample);
   return [json];
};

const reformat = (json) => {
  json.visitor = helper.reformatVisitorInfo(json.visitor);
  return json;
};


module.exports = {
  key: 'chat_started',
  noun: 'New Chat',
  display: {
    label: 'New Chat' ,
    description: 'Triggers when a new chat is started.',
    important: true
  },

  operation: {
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform: getChatStarted,
    performList: getFallbackRealChatStarted,
    sample: sample,
  }
};
