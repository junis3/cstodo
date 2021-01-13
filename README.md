# cstodo

Did cs71107 solve his diamond problems?

This is a slackbot built in order to help cs71107 catch his dream.

## Feature

After installing the bot and inviting the bot into the channel, you can use the following commands.

* Command `cstodo` shows what cs71107 desires to do.

* Command `cstodo format` shows in more neat and organized way what cs71107 desires to do.

* Command `cstodo size` or `cstodo length` shows the length of the cstodo list.

* Command `cstodo add [content]` adds his todo.

* Command `cstodo remove [content]` removes his todo.

* Shows every midnight(KST) problems cs71107 has solved in [BOJ](https://www.acmicpc.net/) yesterday(Either after the preprocessing or the full day).


## Preprocess

Preprocess `cstodo.txt` and `history.txt` which are git-ignored. If you run without the preprocessing, the files won't be generated and will lead to unexpected behaviors.

`yarn`

`yarn preprocess`

## Run

Make file named `.env` on project folder and write

```
SIGNING_SECRET = (your signing secret)
ACCESS_TOKEN = (your access token)
```

Then, Execute

`yarn`

`yarn start`

and slackbot will run on `localhost:3000/cstodo`. If you want to run it on slack, go to [Slack API page](https://api.slack.com/) > Feature > Event subscription and enter `(YOUR PUBLIC IP):3000/cstodo` on Request URL form.

(If your IP is not a public IP, you should forward your IP to public IP using tools like `ngrok`.)