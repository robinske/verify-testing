# verify-testing

Pre reqs: 
Create a [Verify Service](https://www.twilio.com/console/verify/services/)

```
cp .env.example .env
```

Fill in the `.env` variables with the required credentials

Run locally:
```
npm start
```

Note: to protect against fraud, **we recommend running this locally only**. Do not leave this as a live website. This interface is intended to be used during development to test and troubleshoot your verification workflow.
