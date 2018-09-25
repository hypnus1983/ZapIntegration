require('should');

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../index');
const appTester = zapier.createAppTester(App);
const chatendedtrigger = require('../triggers/chatended');

describe('My App', () => {
  
  it('includes the access token in future requests', (done) => {
    const bundle = {
      authData: {
        access_token: 'YX8iGCFzzEdBwWJKbsyFk876eSEuJCFQieo--wxK-8RxzlO6EJndOT-cuZPyySRHdRkuJM1kGDJnAIXAaV0fqFy8JjCtVqKFPsCAviXluAjmPcSx2loRpFTUhEE_B1LJ-4cJgp--koAx75sjr3oTNXEr55PDpn4xQmxRKxFUfgvPDwUxcUzV3apRxjjq3WGR_PChpYpIA1egg6v_Spa9Q_TQdxOifjz56fnLXdWWBq7-EO4yarKqUvzVaPiB1R40L94yOvqsYRFevaccoZWX6w',
        refresh_token: 'V9fguYl3LOLCbF_trrX2exDugFPqEG2SNWACnoVMps4SexHsX2QklHbAQDGRF2LqxYeiYwK5MR37Q6Gw879qtvNs2Zwl0yQUv2hlPMPXRi78i1PWtDkoNsuqZnK6Yv09FriYDCp0WBUpGo9MHrHea24GHpwuhrmLiiuDkGYdnPtvCPR6y-lSlfb59kXaU_5quJUvCItFM_fr5VkVZGo3-9dKe8xUYKOp5KmsZVWYuIcNdI852mJ1ipVozsYVuWE4Nj6wAo63P57ZI9NkWogn-w'
      },
      inputData:{
        state:'123456',
        redirect_uri:'https://www.test.com',
        email: 'vincent@comm300.com',
        siteId: '10000',     
      }
    };

    appTester(App.authentication.oauth2Config.authorizeUrl, bundle)
      .then((response) => {
        //json_response.should.have.property('username')
        console.log('----------------------');
        console.log(response);
        done();
      })
      .catch(done);
  });

  /* it('includes the access token in future requests', (done) => {
    const bundle = {
      authData: {
        access_token: 'YX8iGCFzzEdBwWJKbsyFk876eSEuJCFQieo--wxK-8RxzlO6EJndOT-cuZPyySRHdRkuJM1kGDJnAIXAaV0fqFy8JjCtVqKFPsCAviXluAjmPcSx2loRpFTUhEE_B1LJ-4cJgp--koAx75sjr3oTNXEr55PDpn4xQmxRKxFUfgvPDwUxcUzV3apRxjjq3WGR_PChpYpIA1egg6v_Spa9Q_TQdxOifjz56fnLXdWWBq7-EO4yarKqUvzVaPiB1R40L94yOvqsYRFevaccoZWX6w',
        refresh_token: 'V9fguYl3LOLCbF_trrX2exDugFPqEG2SNWACnoVMps4SexHsX2QklHbAQDGRF2LqxYeiYwK5MR37Q6Gw879qtvNs2Zwl0yQUv2hlPMPXRi78i1PWtDkoNsuqZnK6Yv09FriYDCp0WBUpGo9MHrHea24GHpwuhrmLiiuDkGYdnPtvCPR6y-lSlfb59kXaU_5quJUvCItFM_fr5VkVZGo3-9dKe8xUYKOp5KmsZVWYuIcNdI852mJ1ipVozsYVuWE4Nj6wAo63P57ZI9NkWogn-w'
      }
    };

    appTester(chatendedtrigger.operation.performList, bundle)
      .then((response) => {
        //json_response.should.have.property('username')
        //console.log(response);
        done();
      })
      .catch(done);
  }); */

});
