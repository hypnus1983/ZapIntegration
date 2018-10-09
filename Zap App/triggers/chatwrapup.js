const sample = require('../samples/chatended_sample.json');
const util = require('../commom/util');

const subscribeHook = (z, bundle) => { 
  return util.subscribe(z, bundle, 'chatwrapedup')
};

const unsubscribeHook = (z, bundle) => {
  return util.unsubscribe(z, bundle)
};

const getChatWrapUp = (z, bundle) => {
  const recipe = bundle.cleanedRequest;
  return [recipe];
};

const getFallbackRealChatWrapup = (z, bundle) => { 
   const json = sample;
   return [json];
};

module.exports = {
  key: 'chat_warpup',
  noun: 'Chat Wrapped Up',
  display: {
    label: 'Chat Wrapped Up',
    description: 'Trigger when chat is wrapped up.'
  },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform: getChatWrapUp,
    performList: getFallbackRealChatWrapup,
    sample: sample,
  }
};
