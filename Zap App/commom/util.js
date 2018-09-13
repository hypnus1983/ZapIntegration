const _subscribeHook = (z, bundle, type) => {
    const data = {
      targetUrl: bundle.targetUrl,
      event: type
    };
  
    const options = {
      url: `${process.env.BASE_URL}/api/v2/livechat/webhooks`,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    return z.request(options)
      .then((response) => JSON.parse(response.content));
};
  
const _unsubscribeHook = (z, bundle) => {
    const hookId = bundle.subscribeData.id;
  
    const options = {
      url: `${process.env.BASE_URL}/api/v2/livechat/webhooks/${hookId}`,
      method: 'DELETE',
    };
  
    return z.request(options)
      .then((response) => response.content);
};

const _copyJsonObject = (json) => {
    return JSON.parse(JSON.stringify(json));
}


module.exports = {
    subscribe: _subscribeHook,
    unsubscribe: _unsubscribeHook,
    copyJsonObject: _copyJsonObject,
};
