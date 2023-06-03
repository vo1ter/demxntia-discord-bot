const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js")
const moment = require('moment')
moment.locale("ru")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('pong!'),
	async execute(interaction) {
		await interaction.reply("Pong!")
	},
};