const serviceDetailsFunction = require('../functions/service-details').handler;
const helpers = require('../../test/test-helper');

const mockService = {
  fetch: {
    create: jest.fn(() => Promise.resolve({
      sid: "default"
    }))
  }
}

const mockClient = {
  verify: {
    services: jest.fn(() => mockService)
  }
}

const testContext = {
  VERIFY_SERVICE_SID: 'default',
  getTwilioClient: () => mockClient
};

describe('service details', () => {
  beforeAll(() => {
    helpers.setup({});
  });
  afterAll(() => {
    helpers.teardown();
  });

  test('returns an error response when required parameters are missing', done => {
    const callback = (err, result) => {
      expect(result).toBeDefined();
      expect(result._body.success).toEqual(false);
      expect(mockClient.verify.services).not.toHaveBeenCalledWith(testContext.VERIFY_SERVICE_SID);
      done();
    };
    const event = {};
    checkVerifyFunction(testContext, event, callback);
  });

  test('returns success with valid request', done => {
    const callback = (err, result) => {
      expect(result).toBeDefined();
      expect(result._body.success).toEqual(true);
      expect(mockClient.verify.services).toHaveBeenCalledWith(testContext.VERIFY_SERVICE_SID);
      done();
    };
    checkVerifyFunction(testContext, event, callback);
  });
});
