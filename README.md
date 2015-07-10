# hubot-save-links

A hubot script that saves links
At the moment it supports local redis installations or redis togo service attached in Eroku

See [`src/save-links.coffee`](src/save-links.coffee) for full documentation.

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

The script saves links from messages, discarding duplicats
```
hubot>> hubot  http://example.com
hubot>> hubot  hello, check this: http://example.com
```

## Test

Well, it's version 0.0.1, it works but it's more a POC... :P

## TODO

Check the [open issues](https://github.com/cirpo/hubot-save-links/issues)
