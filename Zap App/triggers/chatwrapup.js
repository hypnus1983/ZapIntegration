const sample = require('../samples/chatended_sample.json');
const util = require('../commom/util');

const subscribeHook = (z, bundle) => { 
  return util.subscribe(z, bundle, 'chatwrapup')
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
  noun: 'Chat Wrap-Up',
  display: {
    label: 'Chat Wrap-Up',
    description: 'Trigger when agent save chat wrap-up form.'
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
