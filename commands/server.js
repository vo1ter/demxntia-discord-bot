const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js")
const moment = require('moment')
const { defaultFooterText, defaultFooterIcon } = require('../config.json');
moment.locale("ru")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Информация про сервер.'),
	async execute(interaction) {
		var server = interaction.guild
        var channelsSum
        var afkChannel = server.afkChannel
        var newsChannel = server.newsChannel
        var rulesChannel = server.rulesChannel
        var systemChannel = server.systemChannel
        var owner

        if(server.afkChannel == null || server.afkChannel == undefined) afkChannel = "отсутствует"
        if(server.systemChannel == null || server.systemChannel == undefined) systemChannel = "отсутствует"
        if(server.rulesChannel == null || server.rulesChannel == undefined) rulesChannel = "отсутствует"
        if(server.newsChannel == null || server.newsChannel == undefined) newsChannel = "отсутствует"

        owner = await interaction.guild.fetch().then(user => user.ownerId);

        await server.channels.fetch().then(channels => channelsSum = channels.size);

        const serverInfoEmbed = new MessageEmbed()
            .setColor(`#ff1414`)
            .setTitle(`Информация про сервер "${server.name}"`)
            .addFields(
                { name: "Общая информация", value: `Название сервера: ${server.name}\nДата создание сервера: ${moment.utc(server.createdTimestamp).format("DD/MM/YYYY")}\nNitro бустов: ${server.premiumSubscriptionCount}` },
                { name: "Участники", value: `\nКол-во участников: ${server.memberCount}\nВладелец сервера: <@${owner}>` },
                { name: "Канали", value: `\nКол-во каналов: ${channelsSum}\nAFK канал: ${afkChannel}\nКанал с правилами: ${rulesChannel}\nКанал с новостями: ${newsChannel}\nСистемный канал: ${systemChannel}` }
            )
            .setTimestamp()
            .setFooter({ text: defaultFooterText, iconURL: defaultFooterIcon })
        await interaction.reply({ embeds: [serverInfoEmbed] });
	},
};