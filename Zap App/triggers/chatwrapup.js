const sample = require('../samples/chatwrappedup_sample.json');
const util = require('../commom/util');
const helper = require('../commom/jsonhelper');

const subscribeHook = (z, bundle) => { 
  return util.subscribe(z, bundle, 'chatwrappedup')
};

const unsubscribeHook = (z, bundle) => {
  return util.unsubscribe(z, bundle)
};

const getChatWrapUp = (z, bundle) => {
  const recipe = reformat(bundle.cleanedRequest);
  return [recipe];
};

const getFallbackRealChatWrapup =  async function(z, bundle) { 
  var sample = await util.getSample(z, bundle,'chatwrappedup');
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
  noun: 'New or Updated Chat Wrap-Up' ,
  display: {
    label: 'New or Updated Chat Wrap-Up',
    description: 'Triggers when a wrap-up is added or updated on a chat.'
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
