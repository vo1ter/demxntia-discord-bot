const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require("discord.js")
const moment = require('moment')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Анмут пользователя.')
        .addUserOption(option => option.setName('name').setDescription('Какого пользователя размучиваем?').setRequired(true)),
	async execute(interaction) {
        if(interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS) == false || interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS) == null) {
            interaction.reply({ content: "У вас нету прав на выполенение этой комманды!", ephemeral: true })
            return
        }
        const user = interaction.options.getUser('name');
        var userKickPerm
        var muteRole = interaction.guild.roles.cache.find((role) => role.name == "Muted")
        var isUserMuted
        
        await interaction.guild.members.fetch(user).then((user) => { isUserMuted = user.roles.cache.find(r => r.name === "Muted") })
        await interaction.guild.members.fetch(interaction.options.getUser('name').id).then((user) => userKickPerm = user.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
        
        if(interaction.member.id == user.id) {
            await interaction.reply({ content: "Вы не можете манипулировать с собой!", ephemeral: true})
            return
        }
        else if(user.id == "887450659153121310") {
            await interaction.reply({ content: "Вы не можете манипулировать с собой!", ephemeral: true})
            return
        }
        else if(userKickPerm == true) {
            await interaction.reply({ content: "Вы не можете манипулировать с пользователем с правом кикать!", ephemeral: true})
            return
        }

        if(isUserMuted == undefined || isUserMuted == null) {
            await interaction.reply({ content: "Вы не можете размутить этого пользователя, ибо он не в муте!", ephemeral: true })
        }
        else {
            await interaction.guild.members.fetch(user).then((user) => { user.roles.remove(muteRole) })
            await interaction.reply({ content: "Пользователя успешно размучено!", ephemeral: true });
        }
	},
};