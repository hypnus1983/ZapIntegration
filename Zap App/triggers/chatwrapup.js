const sample = require('../samples/chatended_sample.json');
const util = require('../commom/util');
const helper = require('../commom/jsonhelper');

const subscribeHook = (z, bundle) => { 
  return util.subscribe(z, bundle, 'chatwrappedup')
};

const unsubscribeHook = (z, bundle) => {
  return util.unsubscribe(z, bundle)
};

const getChatWrapUp = (z, bundle) => {
  const recipe = bundle.cleanedRequest;
  return [recipe];
};

const getFallbackRealChatWrapup = (z, bundle) => { 
  var sample = util.getSample('chatwrappedup');
  const json = reformat(sample);
   return [json];
};

const reformat = (json) => {
  json.visitor = helper.reformatVisitorInfo(json.visitor);
  json.wrapup = helper.reformatWrapup(json.wrapup);
  return json;
}

module.exports = {
  key: 'chat_warpup',
  noun: 'Chat Wrapped Up',
  display: {
    label: 'Chat Wrapped Up',
    description: 'Trigger when an agent wrap-up the chat.'
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
