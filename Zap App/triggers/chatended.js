const sample = require('../samples/chatended_sample.json');
const util = require('../commom/util');
const helper = require('../commom/jsonhelper');

const subscribeHook = (z, bundle) => { 
  return util.subscribe(z, bundle, 'chatEnded')
};

const unsubscribeHook = (z, bundle) => {
  return util.unsubscribe(z, bundle)
};

const getChatended = (z, bundle) => {
  const data = reformatJson(bundle.cleanedRequest);
  return [data];
};

const getFallbackRealChatended = async function(z, bundle) { 
   //var sample = await util.getSample(z, bundle,'chatended');
   const json = reformatJson(sample);
   return [json];
};

const reformatJson = (json) => {
   json.visitor = helper.reformatVisitorInfo(json.visitor);
   json.chat = helper.reformatChatInfo(json.chat);
   return json;
}

module.exports = {
  key: 'chat_ended',
  noun: 'Chat Ended',
  display: {
    label: 'Chat Ended',
    description: 'Trigger when the chat is ended.'
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
