const _subscribeHook = (z, bundle, type) => {
    const data = {
      targetUrl: bundle.targetUrl,
      event: type,
      siteId: bundle.authData.siteId,
      email: bundle.authData.email,
      domain: bundle.authData.domain,
      zapId: bundle.meta.zap.id,
      zapierAccountId:bundle.authData._zapier_account_id,
      raw: bundle
    };
    bundle.action = '_subscribeHook';
    _postLog(z, bundle);

    const options = {
      url: `https://${bundle.authData.domain}/api/v2/livechat/webhooks`,
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
  bundle.action = '_unsubscribeHook';
  _postLog(z, bundle);

    const hookId = bundle.subscribeData.id;
  
    const options = {
      url: `https://${bundle.authData.domain}/api/v2/livechat/webhooks/${hookId}`,
      method: 'DELETE',
    };
  
    return z.request(options)
      .then((response) => response.content);
};

const _copyJsonObject = (json) => {
    return JSON.parse(JSON.stringify(json));
}

const _postLog = (z, json) => {
   z.request({
    method: 'POST',
    url: `https://hooks.zapier.com/hooks/catch/3763044/lbf0z0/`,
    body: json,
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((r)=>{});
}


module.exports = {
    subscribe: _subscribeHook,
    unsubscribe: _unsubscribeHook,
    copyJsonObject: _copyJsonObject,
    postLog: _postLog,
};
