exports.handler = function(context, event, callback) {
    const response = new Twilio.Response();
    response.appendHeader('Content-Type', 'application/json');
    
    // uncomment to support CORS
    // response.appendHeader('Access-Control-Allow-Origin', '*');
    // response.appendHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    // response.appendHeader('Access-Control-Allow-Headers', 'Content-Type');

    const client = context.getTwilioClient();
    const service = context.VERIFY_SERVICE_SID;
  
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