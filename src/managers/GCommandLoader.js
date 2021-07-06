const cmdUtils = require('../util/cmdUtils'), Color = require("../structures/Color"), { Events } = require("../util/Constants")
const axios = require("axios");
const fs = require("fs");
const ms = require("ms");
const { isClass } = require('../util/util');
const Command = require('../structures/Command');

class GCommandLoader {
    constructor(GCommandsClient) {
        this.GCommandsClient = GCommandsClient;
        this.client = this.GCommandsClient.client;

        this.cmdDir = this.GCommandsClient.cmdDir;

        this.__loadCommands()
    }

    /**
     * Internal method to loadCommands
     * @returns {void}
     * @private
     */
     async __loadCommands() {
        await fs.readdirSync(`${__dirname}/../../../../${this.cmdDir}`).forEach(async(dir) => {
            var file;
            var fileName = dir.split(".").reverse()[1]
            var fileType = dir.split(".").reverse()[0]
            if(fileType == "js" || fileType == "ts") {
                try {
                    let finalFile;

                    file = await require(`../../../../${this.cmdDir}${dir}`);
                    if (isClass(file)) {
                        finalFile = new file(this.client)
                        if(!(finalFile instanceof Command)) return console.log(new Color(`&d[GCommands] &cComamnd ${fileName} doesnt belong in Commands.`).getText())
                    } else finalFile = file;

                    if (finalFile && finalFile.aliases && Array.isArray(finalFile.aliases)) finalFile.aliases.forEach(alias => this.client.galiases.set(alias, finalFile.name));
                    this.client.gcommands.set(finalFile.name, finalFile);
                    this.GCommandsClient.emit(Events.LOG, new Color("&d[GCommands] &aLoaded (File): &e➜   &3" + fileName, {json:false}).getText());
                } catch(e) {
                    this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &e("+fileName+") &3"+e).getText());
                    this.GCommandsClient.emit(Events.LOG, new Color("&d[GCommands] &cCan't load " + fileName).getText());
                }
            } else {
                fs.readdirSync(`${this.cmdDir}${dir}`).forEach(async(cmdFile) => {
                    var file2;
                    var fileName2 = cmdFile.split(".").reverse()[1]
                    try {
                        let finalFile2;

                        file2 = await require(`../../../../${this.cmdDir}${dir}/${cmdFile}`);
                        if (isClass(file)) {
                            finalFile2 = new file2(this.client)
                            if(!(finalFile2 instanceof Command)) return console.log(new Color(`&d[GCommands] &cComamnd ${finalFile2} doesnt belong in Commands.`).getText())
                        } else finalFile2 = file2;

                        if (finalFile2.aliases && Array.isArray(finalFile2.aliases)) finalFile2.aliases.forEach(alias => this.client.galiases.set(alias, finalFile2.name));
                        this.client.gcommands.set(finalFile2.name, finalFile2);
                        this.GCommandsClient.emit(Events.LOG, new Color("&d[GCommands] &aLoaded (File): &e➜   &3" + fileName2, {json:false}).getText());
                    } catch(e) {
                        this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands Debug] &e("+fileName2+") &3"+e).getText());
                        this.GCommandsClient.emit(Events.LOG, new Color("&d[GCommands] &cCan't load " + fileName2).getText());
                    }
                })
            }
        })

        await this.__deleteAllGlobalCmds();
    }

    /**
     * Internal method to createCommands
     * @returns {void}
     * @private
     */
    async __createCommands() {
        this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands] &3Creating slash commands...").getText())
        let keys = Array.from(this.client.gcommands.keys());

        keys.forEach(async (cmdname) => {
            this.GCommandsClient.emit(Events.DEBUG, new Color("&d[GCommands] &3Creating slash command (&e"+cmdname+"&3)").getText());
            var options = [];
            var subCommandGroup = {};
            var subCommand = [];
            const cmd = this.client.gcommands.get(cmdname)
            if(cmd.slash == false || cmd.slash == "false") return;

            if(!cmd.name) return console.log(new Color("&d[GCommands] &cParameter name is required! ("+cmdname+")",{json:false}).getText());
            if(!cmd.description) return console.log(new Color("&d[GCommands] &cParameter description is required! ("+cmdname+")",{json:false}).getText());

            if(cmd.subCommandGroup) {
                subCommandGroup = [
                    {
                        name: cmd.subCommandGroup,
                        description: cmd.subCommandGroup,
                        type: 2
                    }
                ]
            }

            if (cmd.expectedArgs) {
                if(typeof cmd.expectedArgs == "object") {
                    cmd.expectedArgs.forEach(option => {
                        options.push({
                            name: option.name,
                            description: option.description,
                            type: option.choices ? 3 : parseInt(option.type),
                            required: option.required ? option.required : false,
                            choices: option.choices ? option.choices : [],
                            options: option.options ? option.options : []
                        })
                    })
                } else {
                    var split = cmd.expectedArgs
                    .substring(1, cmd.expectedArgs.length - 1)
                    .split(/[>\]] [<\[]/)
            
                    for (let a = 0; a < split.length; ++a) {
                        var item = split[a];
                        var option = item.replace(/ /g, '-').split(":")[0] ? item.replace(/ /g, '-').split(":")[0] : item.replace(/ /g, '-');
                        var optionType = item.replace(/ /g, '-').split(":")[1] ? item.replace(/ /g, '-').split(":")[1] : 3;
                        var optionDescription = item.replace(/ /g, '-').split(":")[2] ? item.replace(/ /g, '-').split(":")[2] : item;
                        if(optionType == 1 || optionType == 2) optionType = 3

                        options.push({
                            name: option,
                            description: optionDescription || option,
                            type: parseInt(optionType) || 3,
                            required: a < cmd.minArgs ? cmd.minArgs : 0,
                        })
                    }
                }
            }

            if(cmd.subCommand) {
                cmd.subCommand.forEach(sc => {
                    try {
                        var opt = []
                        var optionsSplit = sc.split(";")[1]

                        if(optionsSplit) {
                            var split = optionsSplit
                                .substring(1, optionsSplit.length - 1)
                                .split(/[>\]] [<\[]/)
                
                            for (let a = 0; a < split.length; ++a) {
                                var item = split[a]
                                var option = item.replace(/ /g, '-').split(":")[0] ? item.replace(/ /g, '-').split(":")[0] : item.replace(/ /g, '-');
                                var optionType = item.replace(/ /g, '-').split(":")[1] ? item.replace(/ /g, '-').split(":")[1] : 3;
                                var optionDescription = item.replace(/ /g, '-').split(":")[2] ? item.replace(/ /g, '-').split(":")[2] : item;
                                if(optionType == 1 || optionType == 2) optionType = 3

                                opt.push({
                                    name: option,
                                    description: optionDescription,
                                    type: parseInt(optionType),
                                    required: a < cmd.minArgs,
                                })
                            }
                        }

                        subCommand.push({
                            name: sc.split(";")[0],
                            description: sc.split(";")[0],
                            type: 1,
                            options: opt || []
                        })
                    } catch(e) {
                        subCommand.push({
                            name: sc.name,
                            description: sc.description,
                            type: 1,
                            options: sc.options || []
                        })
                    }
                })
            }

            if(cmd.subCommandGroup) {
                subCommandGroup = [
                    {
                        name: subCommandGroup[0].name,
                        description: subCommandGroup[0].name,
                        type: subCommandGroup[0].type,
                        options: subCommand
                    }
                ]
            }

            try {
                var url = `https://discord.com/api/v8/applications/${this.client.user.id}/commands`;
        
                if(cmd.guildOnly) url = `https://discord.com/api/v8/applications/${this.client.user.id}/guilds/${cmd.guildOnly}/commands`;

                var cmdd = {
                    name: cmd.name.toLowerCase(),
                    description: cmd.description,
                    options: options || []
                }

                if(cmd.subCommandGroup && cmd.subCommand) {
                     cmdd = {
                        name: cmd.name.toLowerCase(),
                        description: cmd.description,
                        options: subCommandGroup || []
                    };
                } else {
                    cmdd = {
                        name: cmd.name.toLowerCase(),
                        description: cmd.description,
                        options: options || []
                    };
                }

                var config = {
                    method: "POST",
                    headers: {
                        Authorization: `Bot ${this.client.token}`,
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(cmdd), 
                    url,
                }

                axios(config).then((response) => {
                    this.GCommandsClient.emit(Events.LOG, new Color("&d[GCommands] &aLoaded: &e➜   &3" + cmd.name, {json:false}).getText());
                })
                .catch((error) => {
                    this.GCommandsClient.emit(Events.LOG, new Color(`&d[GCommands] ${error.response.status == 429 ? "&aWait &e" + ms(error.response.data["retry_after"] * 1000) : ""} &c${error} &e(${cmd.name})`, {json:false}).getText());

                    if(error.response) {
                        if(error.response.status == 429) {
                            setTimeout(() => {
                                this.__tryAgain(cmd, config)
                            }, (error.response.data["retry_after"]) * 1000)
                        } else {
                            try {
                                this.GCommandsClient.emit(Events.DEBUG, new Color([
                                    "&a----------------------",
                                    "  &d[GCommands Debug] &3",
                                    "&aCode: &b" + error.response.data.code,
                                    "&aMessage: &b" + error.response.data.message,
                                    " ",
                                    "&b" + error.response.data.errors.guild_id._errors[0].code,
                                    "&b" + rror.response.data.errors.guild_id._errors[0].message,
                                    "&a----------------------"
                                ]).getText())
                            } catch(e) {
                                this.GCommandsClient.emit(Events.DEBUG, new Color([
                                    "&a----------------------",
                                    "  &d[GCommands Debug] &3",
                                    "&aCode: &b" + error.response.data.code,
                                    "&aMessage: &b" + error.response.data.message,
                                    "&a----------------------"
                                ]).getText())
                            }  
                        }
                    }
                })
            } catch(e) {
                this.GCommandsClient.emit(Events.DEBUG, e)
            }  
        })
    }

    /**
     * Internal method to tryAgain
     * @returns {void}
     * @private
    */
    async __tryAgain(cmd, config) {
        axios(config).then((response) => {
            this.GCommandsClient.emit(Events.LOG, new Color("&d[GCommands] &aLoaded: &e➜   &3" + cmd.name, {json:false}).getText());
        })
        .catch((error) => {
            this.GCommandsClient.emit(Events.LOG, new Color(`&d[GCommands] ${error.response.status == 429 ? "&aWait &e" + ms(error.response.data["retry_after"] * 1000) : ""} &c${error} &e(${cmd.name})`, {json:false}).getText());
            
            if(error.response) {
                if(error.response.status == 429) {
                    setTimeout(() => {
                        this.__tryAgain(cmd, config)
                    }, (error.response.data["retry_after"]) * 1000)
                }
            }
        })
    }

    /**
     * Internal method to deleteAllGlobalCmds
     * @returns {void}
     * @private
    */
     async __deleteAllGlobalCmds() {
        try {
            var allcmds = await cmdUtils.__getAllCommands(this.client);
            if(!this.client.slash) {
                allcmds.forEach(cmd => {
                    cmdUtils.__deleteCmd(this.client, cmd.id)
                })
            }

            let nowCMDS = [];

            let keys = Array.from(this.client.gcommands.keys());
            keys.forEach(cmdname => {
                nowCMDS.push(cmdname)

                if(this.client.gcommands.get(cmdname).slash == false || this.client.gcommands.get(cmdname).slash == "false") {
                    allcmds.forEach(cmd => {
                        if(cmd.name == cmdname) {
                            cmdUtils.__deleteCmd(this.client, cmd.id)
                        }
                    })
                }
            })

            allcmds.forEach(cmd => {
                let f = nowCMDS.some(v => cmd.name.toLowerCase().includes(v.toLowerCase()))

                if(!f) {
                    cmdUtils.__deleteCmd(this.client, cmd.id)
                }
            })
        } catch(e) {
            return;
        }

        this.__deleteAllGuildCmds()
    }

    /**
     * Internal method to deleteAllGuildCmds
     * @returns {void}
     * @private
    */
    async __deleteAllGuildCmds() {
        try {
            this.client.guilds.cache.forEach(async(guild) => {
                var allcmds = await cmdUtils.__getAllCommands(this.client, guild.id);
                if(!allcmds) return;

                if(!this.client.slash) {
                    allcmds.forEach(cmd => {
                        cmdUtils.__deleteCmd(this.client, cmd.id, guild.id)
                    })
                }

                var nowCMDS = [];
                var keys = Array.from(this.client.gcommands.keys());
                keys.forEach(cmdname => {
                    nowCMDS.push(cmdname)

                    if(this.client.gcommands.get(cmdname).slash == false || this.client.gcommands.get(cmdname).slash == "false") {
                        allcmds.forEach(cmd => {
                            if(cmd.name == cmdname) {
                                cmdUtils.__deleteCmd(this.client, cmd.id, guild.id)
                            }
                        })
                    }
                })

                allcmds.forEach(cmd => {
                    var f = nowCMDS.some(v => cmd.name.toLowerCase().includes(v.toLowerCase()))

                    if(!f) {
                        cmdUtils.__deleteCmd(this.client, cmd.id, guild.id)
                    }
                })
            })

            console.log(new Color("&d[GCommands TIP] &3Are guild commands not deleted when you delete them? Use this site for remove &ehttps://gcommands-slash-gui.netlify.app/").getText())
            if((this.client.slash) || (this.client.slash == "both")) {
                this.__createCommands();
            }
        } catch(e) {
            if((this.client.slash) || (this.client.slash == "both")) {
                this.__createCommands();
            }
        }
    }
}

module.exports = GCommandLoader;