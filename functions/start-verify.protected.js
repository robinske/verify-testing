/**
 *  Start Verification
 *
 *  This Function shows you how to send a verification token for Twilio Verify.
 *
 *  Pre-requisites
 *  - Create a Verify Service (https://www.twilio.com/console/verify/services)
 *  - Add VERIFY_SERVICE_SID from above to your Environment Variables (https://www.twilio.com/console/functions/configure)
 *  - Enable ACCOUNT_SID and AUTH_TOKEN in your functions configuration (https://www.twilio.com/console/functions/configure)
 *
 *
 *  Returns JSON
 *  {
 *    "success": boolean,
 *    "sid": string             // null if success is false
 *    "error": {                // not present if success is true
 *      "message": string,
 *      "moreInfo": url string
 *    }
 *  }
 */

exports.handler = function(context, event, callback) {
    const response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/json');
    
    // uncomment to support CORS
    // response.appendHeader('Access-Control-Allow-Origin', '*');
    // response.appendHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    // response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (typeof event.to === 'undefined') {
      response.setBody({
        "success": false,
        "error": {
          "message": "Missing parameter; please provide a phone number or email.",
          "moreInfo": "https://www.twilio.com/docs/verify/api/verification"
        }
      })
      response.setStatusCode(400);
      return callback(null, response);
    }
  
    const client = context.getTwilioClient();
    const service = context.VERIFY_SERVICE_SID;
    const to = event.to;
    const channel = (typeof event.channel === 'undefined') ? "sms" : event.channel;
    const locale = (typeof event.locale === 'undefined') ? "en" : event.locale;
  
    client.verify.services(service)
      .verifications
      .create({
        to: to,
        channel: channel,
        locale: locale
      })
      .then(verification => {
        console.log(`Sent verification: '${verification.sid}'`);
        response.setStatusCode(200);
        verification.success = true
        response.setBody(verification);
        callback(null, response);
      })
      .catch(error => {
        // console.log(error);
        console.log(error.message);
        response.setStatusCode(error.status);
        var details = error;
        details.success = false;
        details.message = error.prototype.message;
        error['success'] = false;
        error['message'] = error.prototype.message;
        console.log(error);
        console.log(details);
        response.setBody(error);
        callback(null, response);
      });
  };