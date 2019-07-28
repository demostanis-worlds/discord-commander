# Discord-commander
## Easily make commands for your discord bot

## Install
```sh
npm install --save discord-commander
```

## Import
```js
/**
 * ES6
 */

import { DiscordCommander } from "discord-commander"
import Discord from "discord.js"

/**
 * CommonJS
 */

const { DiscordCommander } = require("discord-commander")
const Discord = require("discord.js")
```

## Usage
```js
new DiscordCommander({
  client: Discord.Client,
  vipRole?: string|false,
  vipOnlyMessage?: string,
  argumentRequiredMessage: string,
  commands: DiscordCommander.Command[]
})
```