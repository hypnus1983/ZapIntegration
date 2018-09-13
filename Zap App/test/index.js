require('should');

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../index');
const appTester = zapier.createAppTester(App);

describe('My App', () => {
  
  it('includes the access token in future requests', (done) => {
    const bundle = {
      authData: {
        access_token: '2WFeRV8fQG3Cuu_nhkdbcWG-5eC2PDKOglM5ckHhH7gpsmWVXiCOggvLMBpbYOXeZXomIQ5lm9RkYGHdnuQQoMdQtzGJ4VRukWgjdKReaHSIqafbIZVfHset9hwI0EieQ9PIoDyUoMdFVDSQ4E6NSrYf4-brUqn61dZP7a5n4GS7OZg3NZYBmHrHnuXeCR4tL7Wm7Rqdn2wfetxaVwF9wPDbt365YniVBf1owygxsfdAyjKhZrNHZKYQ1UOxywNAfle-YOFeyJ4qCnsrF68U0w',
        refresh_token: 'V9fguYl3LOLCbF_trrX2exDugFPqEG2SNWACnoVMps4SexHsX2QklHbAQDGRF2LqxYeiYwK5MR37Q6Gw879qtvNs2Zwl0yQUv2hlPMPXRi78i1PWtDkoNsuqZnK6Yv09FriYDCp0WBUpGo9MHrHea24GHpwuhrmLiiuDkGYdnPtvCPR6y-lSlfb59kXaU_5quJUvCItFM_fr5VkVZGo3-9dKe8xUYKOp5KmsZVWYuIcNdI852mJ1ipVozsYVuWE4Nj6wAo63P57ZI9NkWogn-w'
      },
    };

    appTester(App.authentication.test, bundle)
      .then((response) => {
        //json_response.should.have.property('username')
        done();
      })
      .catch(done);
  });

});
