const sample = require('../samples/chatended_sample.json');
const util = require('../commom/util');

const subscribeHook = (z, bundle) => { 
  return util.subscribe(z, bundle, 'chatrequest')
};

const unsubscribeHook = (z, bundle) => {
  return util.unsubscribe(z, bundle)
};

const getChatRequest = (z, bundle) => {
  const recipe = bundle.cleanedRequest;
  return [recipe];
};

const getFallbackRealChatRequest = (z, bundle) => { 
   const json = sample;
   return [json];
};

module.exports = {
  key: 'chat_requestd',
  noun: 'Chat Requestd',
  display: {
    label: 'Chat Requestd',
    description: 'Trigger when a new chat is requested.'
  },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform: getChatRequest,
    performList: getFallbackRealChatRequest,
    sample: sample,
  }
};
