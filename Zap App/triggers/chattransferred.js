const sample = require('../samples/chatended_sample.json');
const util = require('../commom/util');
const helper = require('../commom/jsonhelper');

const subscribeHook = (z, bundle) => { 
  return util.subscribe(z, bundle, 'chatTransferred')
};

const unsubscribeHook = (z, bundle) => {
  return util.unsubscribe(z, bundle)
};

const getChatTransferred = (z, bundle) => {
  const recipe = bundle.cleanedRequest;
  return [recipe];
};

const getFallbackRealChatTransferred = (z, bundle) => { 
  var sample = util.getSample('chattransferred');
  const json = reformat(sample);
   return [json];
};

const reformat = (json) => {
  json.visitor = helper.reformatVisitorInfo(json.visitor);
  json.chat = helper.reformatChatInfo(json.chat);
  return json;
}

module.exports = {
  key: 'chat_transferred',
  noun: 'Chat Transferred',
  display: {
    label: 'Chat Transferred',
    description: 'Trigger when a chat is transferred.'
  },
  operation: {
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform: getChatTransferred,
    performList: getFallbackRealChatTransferred,
    sample: sample,
  }
};
