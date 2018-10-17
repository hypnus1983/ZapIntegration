const sample = require('../samples/chatended_sample.json');
const util = require('../commom/util');
const helper = require('../commom/jsonhelper');

const subscribeHook = (z, bundle) => { 
  return util.subscribe(z, bundle, 'chatRequested')
};

const unsubscribeHook = (z, bundle) => {
  return util.unsubscribe(z, bundle)
};

const getChatRequest = (z, bundle) => {
  const recipe = bundle.cleanedRequest;
  return [recipe];
};

const getFallbackRealChatRequest = (z, bundle) => { 
  var sample = util.getSample('chatrequested');
  const json = reformat(sample);
   return [json];
};

const reformat = (json) =>{
  json.visitor = helper.reformatVisitorInfo(json.visitor);
  return json;
}

module.exports = {
  key: 'chat_requestd',
  noun: 'Chat Requestd',
  display: {
    label: 'Chat Requestd',
    description: 'Trigger when a visitor begin a chat request.'
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
