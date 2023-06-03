const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js")
const moment = require('moment')
moment.locale("ru")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user-info')
		.setDescription('Информация про пользователя.')
        .addUserOption(option => option.setName('name').setDescription('Про какого пользователя смотрим информацию?').setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('name')
        var joinedTimestamp

        await interaction.guild.members.fetch(user).then(user => joinedTimestamp = user.joinedTimestamp)

        const serverInfoEmbed = new MessageEmbed()
            .setColor(`#ff1414`)
            .setTitle(`Інформація про користувача ${user.username}#${user.discriminator}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: `Общая информация`, value: `Имя: ${user.username}\nДискриминатор: ${user.discriminator}\nПолный тэг: ${user.username}#${user.discriminator}\nID: ${user.id}\nДата регистрации: ${moment.utc(user.createdTimestamp).format("DD/MM/YYYY")}\nДата присоединения к серверу: ${moment.utc(joinedTimestamp).format("DD/MM/YYYY")}\n` },
            )
            .setTimestamp()
            .setFooter({ text: "Designed and coded for DEMXNTIA", iconURL: "https://cdn.vo1ter.me/demxntia.png" });
        await interaction.reply({ embeds: [serverInfoEmbed] });
	},
};