# cstodo

Did cs71107 solve his diamond problems?

This is a slackbot living in _koosaga slack_ built in order to help cs71107 catch his dream.

## Feature

After installing the bot and inviting the bot into the channel, you can use the two following features.


### Todo Database


* Command `cstodo` shows what cs71107 desires to do.

* Command `cstodo add [content]` adds his todo.

* Command `cstodo remove [number]` removes his todo.

### Midnight Diamond Alert

* Shows every midnight(KST) problems cs71107 has solved in [BOJ](https://www.acmicpc.net/) yesterday(Either after the preprocessing or the full day).


## Build

### Preperation

#### Yarn

You first need node.js, npm (node.js package manager) and yarn in order to build the project. If you are not familiar, please search. If you have all of them ready, command

`yarn`

will get all your required packages to build your code ready.

#### MongoDB

You then need a running mongoDB server. You can either configure your mongoDB server locally or use a cloud server. Check [mongodb.com] for detail.

#### .env

Make file named `.env` on your project folder and write

```
SIGNING_SECRET = Your signing secret to [Slack API](https://api.slack.com/)
ACCESS_TOKEN = Your access token to [Slack API](https://api.slack.com/)
LOG_WEBHOOK = Optional, webhook address to log on the testing channel
MONGODB_URI = URI to Mongodb database which saves all TODOs
PORT = A port you want to run the project; Defaults to 3000 if not given
```

Contact me if you are a _koosaga slack_ member who wants to contribute on the slack, or you should generate one for your own slack.

If you want to eliminate unnecessary logs on test channel (if the app is on production), append

```
IS_PRODUCTION = true
```

on the file.

## Test

You may run unit tests by command `yarn jest`.
We name test suites by `<module-name>.test.ts`.

### Run

`yarn start`

and slackbot will run on `localhost:3000/cstodo`. If you want to run it on slack, [create a new new slackbot app](https://api.slack.com/apps) and go to administrating page for the app > Feature > Event subscription and enter `(YOUR PUBLIC IP):3000/cstodo` on Request URL form. (If your IP is not a public IP, you should forward your IP to public IP using tools like `ngrok`.)

If you want to forward the log messages and the error messages to your slack, go to app > Feature > Incoming Webhook and create a webhook URL for the testing channel.

### Use PM2

PM2 is a package which can manage deployment. It will run the project on the background. It can also automatically restart the run if the project is changed, or the project is crashed.

If you want to use PM2, you should execute

`yarn pm2 install typescript`

for the first time. Execute

`yarn pm2 start`

to start the process and

`yarn pm2 stop cstodo`

to stop the process.