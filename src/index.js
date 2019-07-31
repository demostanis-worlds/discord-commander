import * as Discord from "discord.js";
class DiscordCommander {
    constructor(config) {
        this.config = config;
        this.config.client.on("message", (msg) => {
            if (this.config.disableDMs && msg.channel instanceof Discord.DMChannel)
                return;
            !msg.author.bot && this.exec(msg);
        });
        this.config.commands.forEach(cmd => cmd.inTimeout = false);
    }
    exec(msg) {
        const message = msg.content.replace(/\s+/g, " ");
        const command = this.config.commands.find((cmd) => cmd.name === message.split(" ")[0]);
        const parts = message.split(" ");
        const argumentList = [];
        const optionList = [];
        if (!command)
            return;
        if (command.vipOnly && this.config.vipRole && msg.member && !msg.member.roles.has(this.config.vipRole)) {
            msg.reply(this.config.vipOnlyMessage);
            return;
        }
        if (command.timeout && command.inTimeout && msg.member && this.config.vipRole && !msg.member.roles.has(this.config.vipRole)) {
            msg.channel.send(this.config.timeoutMessage);
            return;
        }
        else if (command.timeout) {
            command.inTimeout = true;
            setTimeout(() => command.inTimeout = false, command.timeout);
        }
        let c = true;
        parts.forEach((part, i) => {
            for (let opt in command.optionList) {
                if (command.optionList[opt].name === part) {
                    if (this.config.vipRole) {
                        if (command.optionList[opt].vipOnly && msg.member && !msg.member.roles.has(this.config.vipRole)) {
                            msg.reply(this.config.vipOnlyMessage);
                            return c = false;
                        }
                    }
                    optionList.push({
                        name: command.optionList[opt].name,
                        value: parts[i + 1] || true,
                        rawOption: command.optionList[opt]
                    });
                }
            }
        });
        parts.forEach(part => {
            if (part !== parts[0] && !optionList.find(({ name }) => name === part)) {
                if (!command.argumentList[argumentList.length])
                    return;
                argumentList.push({
                    name: command.argumentList[argumentList.length].name,
                    value: part,
                    rawArgument: command.argumentList[argumentList.length]
                });
            }
        });
        for (const arg of command.argumentList) {
            if (arg.required && !argumentList.find(({ name }) => name === arg.name)) {
                msg.reply(this.config.argumentRequiredMessage);
                return;
            }
        }
        Object.assign(argumentList, {
            get(e) {
                const arg = this.find(({ name }) => name === e);
                return arg ? arg.value : undefined;
            }
        });
        Object.assign(optionList, {
            get(e) {
                const opt = this.find(({ name }) => name === e);
                return opt ? opt.value : undefined;
            }
        });
        c && command.does && command.does(msg, argumentList, optionList);
    }
}
export default DiscordCommander;
export { DiscordCommander };
