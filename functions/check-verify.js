/**
 *  Check Verification
 *
 *  This Function shows you how to check a verification token for Twilio Verify.
 *
 *  Pre-requisites
 *  - Create a Verify Service (https://www.twilio.com/console/verify/services)
 *  - Add VERIFY_SERVICE_SID from above to your Environment Variables (https://www.twilio.com/console/functions/configure)
 *  - Enable ACCOUNT_SID and AUTH_TOKEN in your functions configuration (https://www.twilio.com/console/functions/configure)
 *
 *  Parameters:
 *   to                 | email, e.164 formatted phone number, or verification SID
 *   verification_code  | one-time passcode sent to the user
 *
 *  Returns JSON:
 *  {
 *    "success": boolean,
 *    "message": string
 *  }
 */

exports.handler = function(context, event, callback) {
    const response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/json');
    
    // uncomment to support CORS
    // response.appendHeader('Access-Control-Allow-Origin', '*');
    // response.appendHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    // response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (typeof event.to === 'undefined' ||
        typeof event.verification_code === 'undefined') {
      response.setBody({
        success: false,
        message: 'Missing parameter.'
      })
      response.setStatusCode(400);
      return callback(null, response);
    }
  
    const client = context.getTwilioClient();
    const service = context.VERIFY_SERVICE_SID;
    const to = event.to;
    const code = event.verification_code;

    const verificationKey = to.startsWith('VE') ? 'verificationSid' : 'to';

    client.verify.services(service)
      .verificationChecks
      .create({
        [verificationKey]: to,
        code: code
      })
      .then((check) => {
        if (check.status === 'approved') {
          response.setStatusCode(200);
          response.setBody({
            success: true,
            message: `Verification '${to}' approved.`
          });
          callback(null, response);
        } else {
          response.setStatusCode(401);
          response.setBody({
            success: false,
            message: 'Incorrect token.'
          });
          callback(null, response);
        }
      })
      .catch((error) => {
        response.setStatusCode(error.status);
        var details = '';
        if (error.status == 404) {
          details = 'Note: Twilio deletes the verification SID once it is expired, approved, or when the max attempts to check a code have been reached. If you’d like to double check what happened with a given verification, please use the logs found in the Twilio Console under your Verification Service.'
        }
        response.setBody({
          success: false,
          message: `${error.message}.\n\n${details}`
        });
        callback(null, response);
      });
  };
  