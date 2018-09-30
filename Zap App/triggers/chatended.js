const sample = require('../samples/chatended_sample.json');
const util = require('../commom/util');

const subscribeHook = (z, bundle) => { 
  return util.subscribe(z, bundle, 'chatEnded')
};

const unsubscribeHook = (z, bundle) => {
  return util.unsubscribe(z, bundle)
};

const getChatended = (z, bundle) => {

  const recipe = reformatJson(bundle.cleanedRequest);

  return [recipe];
};

const getFallbackRealChatended = (z, bundle) => { 
   const json = reformatJson(sample);
   return [json];
};


const reformatJson = (json) => {
   const copy = util.copyJsonObject(json);
    if(copy.chat && copy.chat.chat_transcript) {
      const transcript = JSON.stringify(copy.chat.chat_transcript).replace(/⊙/g,'\n');
      copy.chat.chat_transcript = transcript;
    }
    return copy;
}

module.exports = {
  key: 'chat_ended',
  noun: 'Chat Ended',
  display: {
    label: 'Chat Ended',
    description: 'Trigger when a chat is ended.'
  },

  operation: {
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform: getChatended,
    performList: getFallbackRealChatended,
    sample: sample,
  }
};
