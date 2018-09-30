const sample = require('../samples/chatstarted_sample.json');
const util = require('../commom/util');

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

const getFallbackRealChatStarted = (z, bundle) => {    
   const json = reformat(sample);
   return [json];
};

const reformat = (json) => {
    const copy = util.copyJsonObject(json);
    util.reformatCustomFields(copy.visitor);
    util.reformatCustomVariables(copy.visitor);
    return copy;
};


module.exports = {
  key: 'chat_started',
  noun: 'Chat Started',
  display: {
    label: 'Chat Started',
    description: 'Trigger when a new chat is started.'
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
