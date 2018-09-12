const getAccessToken = (z, bundle) => {
   const promise = z.request(`${process.env.BASE_URL}/OAuthServer/oauth/token`, {
    method: 'POST',
    body: {
      code: bundle.inputData.code,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      siteId: bundle.inputData.siteId, //process.env.SITE_ID,
      redirect_uri: bundle.inputData.redirect_uri
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  });

  // Needs to return at minimum, `access_token`, and if your app also does refresh, then `refresh_token` too
  return promise.then((response) => {
    if (response.status !== 200) {
      throw new Error('Unable to fetch access token: ' + response.content);
    }
    const result = JSON.parse(JSON.stringify(response.json));
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      token_type: result.token_type,
      expires_in: result.expires_in,
      site_id: bundle.inputData.siteId,
    };
  });
};

const refreshAccessToken = (z, bundle) => {
  const promise = z.request(`${process.env.BASE_URL}/OAuthServer/oauth/token`, {
    method: 'POST',
    body: {
      refresh_token: bundle.authData.refresh_token,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'refresh_token'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  });

  // Needs to return `access_token`. If the refresh token stays constant, can skip it. If it changes, can
  // return it here to update the user's auth on Zapier.
  return promise.then((response) => {
    if (response.status !== 200) {
      throw new Error('Unable to fetch access token: ' + response.content);
    }
    const result = JSON.parse(JSON.stringify(response.json));
    return {
      access_token: result.access_token,
      refresh_token: result.refresh_token,
      expires_in: result.expires_in
    };
  });
};

const testAuth = (z , bundle) => {
  // Normally you want to make a request to an endpoint that is either specifically designed to test auth, or one that
  // every user will have access to, such as an account or profile endpoint like /me.
  const promise = z.request({
    method: 'GET',
    url: `${process.env.BASE_URL}/api/v2/livechat/cannedMessages`,
    headers: {
      'Authorization': `bearer ${bundle.authData.access_token}`
    },
  });

  // This method can return any truthy value to indicate the credentials are valid.
  // Raise an error to show
  return promise.then((response) => {
    //console.log(response);
     if (response.status === 401) {
      throw new Error('The access token you supplied is not valid');
    }
    const result = JSON.parse(JSON.stringify(response.json));
  });
};

const getAuthorizeUrl = (z, bundle) => {
  let url = `${process.env.BASE_URL}/OAuthServer/oauth/authorize?`;
  url += `client_id=${process.env.CLIENT_ID}`;
  url += `&state=${bundle.inputData.state}`;
  url += `&redirect_uri=${bundle.inputData.redirect_uri}`;
  url += `&siteId=${bundle.inputData.siteId}`;
  url += `&response_type=code`;
  return url;
}

const getConnectionLabel = (z, bundle) => {
  return `Site${bundle.authData.site_id}`;
}

module.exports = {
  type: 'oauth2',
  oauth2Config: {
    // Step 1 of the OAuth flow; specify where to send the user to authenticate with your API.
    // Zapier generates the state and redirect_uri, you are responsible for providing the rest.
    // Note: can also be a function that returns a string
    /* authorizeUrl: {
      url: `${process.env.BASE_URL}/OAuthServer/oauth/authorize`,
      params: {
        client_id: '{{process.env.CLIENT_ID}}',
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        siteId: '{{process.env.SITE_ID}}',
        response_type: 'code'
      }
    }, */

    authorizeUrl: getAuthorizeUrl,

    // Step 2 of the OAuth flow; Exchange a code for an access token.
    // This could also use the request shorthand.
    getAccessToken: getAccessToken,
    // (Optional) If the access token expires after a pre-defined amount of time, you can implement
    // this method to tell Zapier how to refresh it.
    refreshAccessToken: refreshAccessToken,
    // If you want Zapier to automatically invoke `refreshAccessToken` on a 401 response, set to true
    autoRefresh: true
    // If there is a specific scope you want to limit your Zapier app to, you can define it here.
    // Will get passed along to the authorizeUrl
    // scope: 'read,write'
  },
  fields: [
    {key: 'siteId', label: 'Site Id', required: true, type: 'string'},
  ],
  // The test method allows Zapier to verify that the access token is valid. We'll execute this
  // method after the OAuth flow is complete to ensure everything is setup properly.
  test: testAuth,
  // assuming "username" is a key returned from the test
  connectionLabel: getConnectionLabel
};
