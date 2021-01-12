# cstodo

Did cs71107 solve his diamond problems?

This is a slackbot built in order to help cs71107 catch his dream.

## Feature

After installing the bot and inviting the bot into the channel, you can use the following commands.

* Command `cstodo` shows what cs71107 wants to do

* Command `cstodo add [content]` adds his todo.

* Command `cstodo remove [content]` removes his todo.

* Shows every midnight(KST) problems cs71107 has solved in [BOJ](https://www.acmicpc.net/) yesterday(Either after the preprocessing or the full day).


## Preprocess

Preprocess `cstodo.txt` and `history.txt` which are git-ignored. If you run without the preprocessing, the files won't be generated and will lead to unexpected behaviors.

`yarn`

`yarn preprocess`

## Run

Write

`export const signingSecret = 'YOUR SLACKBOT SIGNING SECRET';`

`export const accessToken = 'YOUR SLACKBOT ACCESS TOKEN';`

in `src/config.ts` (after making the file)

Execute

`yarn`

`yarn start`