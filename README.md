# Hubot-save-links [![Build Status](https://travis-ci.org/cirpo/hubot-save-links.svg?branch=master)](https://travis-ci.org/cirpo/hubot-save-links)


A hubot script that saves links and exposes an api to retrieve them.
At the moment it supports local redis installations or redis togo service attached in Eroku

The links are available via GET /links (hubot has express inside :)

See [`src/save-links.js`](src/save-links.js) for the bot script documentation.
See  hubot scripting [documentation](https://hubot.github.com/docs/scripting/) for more info.

## Installation

Install [Hubot](https://hubot.github.com/)

In hubot project repo, run:

`npm install hubot-save-links --save`

Then add **hubot-save-links** to your `external-scripts.json`:

```json
[
  "hubot-save-links"
]
```


## Sample Interaction

The script saves links from messages, discarding duplicates
If you want to try locally simply launch hubot
```
bin/hubot
```
```
hubot>> hubot  http://example.com
hubot>> hubot  hello, check this: http://anotherexample.com
```
The above links will be saved in redis


## Debug

If you want a verbose logging on the console simply launch hubot with the env variable
DEBUG

```
DEBUG=save-links bin/hubot
```
more verbose:

```
DEBUG=* bin/hubot
```

## Test

```
grunt test
```

## TODO

Check the [open issues](https://github.com/cirpo/hubot-save-links/issues)
Feel free to open issues for suggestions.
Oh, lets start writing test :P
