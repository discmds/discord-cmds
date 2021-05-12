const { MessageEmbed } = require("discord.js");
const { SlashCommand } = require("gcommands")

module.exports = {
	name: "test",
	aliases: ["ccc"],
	description: "Test",
	//expectedArgs: '<enable:6:description> <test>',
	/*expectedArgs: [
		{
			name: "list",
			type: SlashCommand.STRING,
			description: "helllo",
			required: true,
			choices: [
				{
					name: "Hyro Dog",
					value: "dogik"
				},
				{
					name: "Pancucha",
					value: "pancier"
				}
			]
		},
		{
			name: "user",
			type: SlashCommand.USER,
			description: "select user",
			required: false
		}
	],*/

	subCommandGroup: "group",
	subCommand: [
		{
			name: "button",
			description: "button idk",
			options: [
				{
					name: "enable",
					type: SlashCommand.USER,
					description: "enable",
					required: true
				}
			]
		}
	],
	//subCommand: ["button;<enable:6:imgood> <test>","pog;<disable> <button>"],

	minArgs: 1,
	cooldown: 3,
	guildOnly: "id", //["id","id2"]
	userOnly: "id",
	channelOnly: "id", //["id","id2"]
	requiredPermission: "ADMINISTRATOR",
	requiredPermissionMessage: "You need have ADMINISTRATOR perms.",
	requiredRole: "ROLE ID",
	requiredRoleMessage: "You doesn't have role!",
	//slash: false,
	run: async(client, slash, message, args) => {
		if(message) {
			if(args[0]) {
				return message.channel.send("My ping is `" + Math.round(client.ws.ping) + "ms`")
			} else {
				return message.channel.send("Need args")
			}
			return;
		}

		return {
			content: "My ping is `" + Math.round(client.ws.ping) + "ms`",
			ephemeral: true,
			allowedMentions: { parse: [], repliedUser: true }
		}

		/*
						CAN USE
		return "My ping is `" + Math.round(client.ws.ping) + "ms`"
		*/
	}
};
