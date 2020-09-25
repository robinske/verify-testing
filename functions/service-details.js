/**
 *  Service Details
 *
 *  This Function returns details about the verification service used in this project.
 *  The Verify Service SID is pulled from environment variables.
 *
 *  Pre-requisites
 *  - Create a Verify Service (https://www.twilio.com/console/verify/services)
 *  - Add VERIFY_SERVICE_SID from above to your Environment Variables (https://www.twilio.com/console/functions/configure)
 * 
 *  Parameters:
 *   NONE
 *
 */

exports.handler = function(context, event, callback) {
    const response = new Twilio.Response();

    // const client = require('twilio')(context.ACCOUNT_SID, context.AUTH_TOKEN);
    response.appendHeader('Content-Type', 'application/json');
    
    // uncomment to support CORS
    // response.appendHeader('Access-Control-Allow-Origin', '*');
    // response.appendHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    // response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

    const client = context.getTwilioClient();

    client.verify.services.list({limit: 10})
      .then(services => console.log(services.sid))
      .catch(e => console.log(e))

    const service = context.VERIFY_SERVICE_SID;

    console.log("CLIENT???")
    console.log(client)
    console.log(context.ACCOUNT_SID)
    console.log(context.AUTH_TOKEN)
    console.log(context.getTwilioClient())
  
    client.verify.services(service)
      .fetch()
      .then(service => {
        response.setStatusCode(200);
        service.success = true;
        response.setBody(service);
        callback(null, response);
      })
      .catch(error => {
        response.setStatusCode(error.status);
        response.setBody({
          success: false,
          error: {
            sid: service,
            message: error.message,
            moreInfo: error.moreInfo
          }
        });
        callback(null, response);
      });
  };