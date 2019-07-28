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

## Examples
```js
import { DiscordCommander } from "discord-commander"
import Discord from "discord.js"
 
const client = new Discord.Client()
 
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
 
  const commander = new DiscordCommander({
    client: client,
    vipRole: "604250294846750720",
    vipOnlyMessage: "Sorry! This command is only available for VIPs.",
    argumentRequiredMessage: "It seems that you forgot an argument which is required...",
    commands: [{
      name: "*order-pizza",
      description: "Orders pizza.",
      argumentList: [{
        name: "type",
        description: "Sets the type of the pizza you're ordering.",
        required: true
      }],
      optionList: [{
        name: "--cheeze",
        description: "Adds some cheeze to your pizza."
      }, {
        name: "--mushrooms",
        description: "Adds some mushrooms to your pizza.",
        vipOnly: true
	  }],
	  does(message, argumentList, optionList) {
		const type = argumentList.get("type")
		const cheeze = optionList.get("--cheeze")
		const mushrooms = optionList.get("--mushrooms")
   
		message.channel.send(`Ordering ${type} pizza with: `)
   
		if(cheeze) {
		  message.channel.send("Some cheeze")
		}
   
		if(mushrooms) {
		  message.channel.send("Some mushrooms")
		}
   
		orderPizza(type, cheeze, mushrooms)
	  }
	}]
  })
})
 
client.login(TOKEN)
```

## Issues
- For any issue, please tell them [here](https://github.com/demostanis-worlds/discord-commander/issues).
