# verify-testing

Pre reqs: 
[Twilio CLI](https://www.twilio.com/docs/twilio-cli/quickstart)
Create a [Verify Service](https://www.twilio.com/console/verify/services/)

```
cp .env.example .env
```

Fill in the `.env` variables with the required credentials

Run locally:
```
npm start
```

Deploy:
```
twilio serverless:deploy
```
