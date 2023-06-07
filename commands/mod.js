const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, Permissions, StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder } = require("discord.js")
const moment = require('moment')
const { defaultFooterText, defaultFooterIcon } = require('../config.json');
const fs = require("fs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mod')
		.setDescription('Модераторские действия с пользователями.')
        .addUserOption(option => option.setName('name').setDescription('Над кем вершим правосудие?').setRequired(true)),
	async execute(interaction) {
        if(interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS) == false || interaction.member.permissions.has(Permissions.FLAGS.KICK_MEMBERS) == null) {
            interaction.reply({ content: "У вас нету прав на выполелние этой комманды!", ephemeral: true })
            return
        }
        const user = interaction.options.getUser('name');
        var userKickPerm
        var muteRole = interaction.guild.roles.cache.find((role) => role.name == "Muted")
        var isUserMuted
        
        await interaction.guild.members.fetch(interaction.options.getUser('name').id).then((user) => userKickPerm = user.permissions.has(Permissions.FLAGS.KICK_MEMBERS))
        
        const successfullEmbed = new MessageEmbed()
            .setColor(`#32a832`)
            .setTitle(`Действия с ${user.username}#${user.discriminator}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: `Исполнение действия`, value: `Действие с ${user.username}#${user.discriminator} выполнено успешно!` },
            )
            .setTimestamp()
            .setFooter({ text: defaultFooterText, iconURL: defaultFooterIcon });

        const tempmuteEmbed = new MessageEmbed()
            .setColor(`#32a832`)
            .setTitle(`Действия с ${user.username}#${user.discriminator}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: `Временный мут`, value: `Выберите срок мута` },
            )
            .setTimestamp()
            .setFooter({ text: defaultFooterText, iconURL: defaultFooterIcon });
        
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
        await interaction.guild.members.fetch(user).then(user => joinedTimestamp = user.joinedTimestamp)

        const buttonsRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
					.setCustomId('mute')
					.setLabel('Перма мут') //(с)перма
					.setStyle('DANGER'),
                // new MessageButton()
				// 	.setCustomId('tempmute')
				// 	.setLabel('Временный мут')
				// 	.setStyle('DANGER'),
                new MessageButton()
					.setCustomId('kick')
					.setLabel('Кик')
					.setStyle('DANGER'),
                new MessageButton()
					.setCustomId('ban')
					.setLabel('Бан')
					.setStyle('DANGER'),
                new MessageButton()
					.setCustomId('exit')
					.setLabel('Выйти')
					.setStyle('PRIMARY'),
            );

        const tempmuteButtonsRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
					.setCustomId('1')
					.setLabel('1 минута')
					.setStyle('PRIMARY'),
                new MessageButton()
					.setCustomId('5')
					.setLabel('5 минут')
					.setStyle('PRIMARY'),
                new MessageButton()
					.setCustomId('15')
					.setLabel('15 минут')
					.setStyle('PRIMARY'),
                new MessageButton()
					.setCustomId('30')
					.setLabel('30 минут')
					.setStyle('PRIMARY'),
                new MessageButton()
					.setCustomId('exit')
					.setLabel('Выйти')
					.setStyle('PRIMARY'),
            );

        const filter = interaction => interaction.isButton = true
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
        collector.on('collect', async i => {
            if (i.user.id === interaction.user.id) {
                if(i.customId == "kick") {
                    await interaction.guild.members.fetch(user).then(user => user.kick(`Кикнуто пользователем ${i.user.username}#${i.user.discriminator}.`))
                    await i.update({ embeds: [successfullEmbed], components: [] })
                }
                else if(i.customId == "ban") {
                    await interaction.guild.members.fetch(user).then(user => user.ban({ reason: `Забанено пользователем ${i.user.username}#${i.user.discriminator}.` }))
                    await i.update({ embeds: [successfullEmbed], components: [] })
                }
                else if(i.customId == "mute" || i.customId == "tempmute") {
                    if(muteRole == null || muteRole == undefined) {
                        await interaction.guild.roles.create({ name: "Muted", color: "#545454", mentionable: false, permissions: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CONNECT, Permissions.FLAGS.SPEAK, Permissions.FLAGS.STREAM] })
                    }
                    await interaction.guild.members.fetch(user).then((user) => { isUserMuted = user.roles.cache.find(r => r.name === "Muted") })
                    if(isUserMuted == undefined || isUserMuted == null) {
                        // if(i.customId == "tempmute") {
                        //     console.log("test")
                        //     await i.update({ embeds: [tempmuteEmbed], components: [tempmuteButtonsRow] })
                        //     const tempmuteFilter = interaction => interaction.isButton = true
                        //     const tempmuteCollector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
                        //     await tempmuteCollector.on('collect', async i => {
                        //         console.log(i)
                        //         fs.writeFile("../tempMutes.json", JSON.stringify({ userId: user.userId, muteTime: toString(i.customId)}), (error) => {
                        //             if(error) {
                        //                 console.log(error)
                        //             }
                        //         });
                        //     });
                        // }
                        await interaction.guild.members.fetch(user).then((user) => { user.roles.add(muteRole) })
                        await i.update({ embeds: [successfullEmbed], components: [] })
                    }
                    else {
                        await i.update({ content: "Вы не можете замутить пользователя, который уже в муте!", embeds: [], components: [] })
                    }
                }
                else {
                    collector.stop();
                }
                setTimeout(() => {
                    collector.stop()
                }, 5000)
            }
            else {
                i.reply({ content: `Вы не можете взаимодействовать с этими кнопками!`, ephemeral: true });
            }
        });

        collector.on('end', collected => {
            interaction.deleteReply()
            return
        });

        const modEmbed = new MessageEmbed()
            .setColor(`#ff1414`)
            .setTitle(`Манипулирование с ${user.username}#${user.discriminator}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: `Информация про пользователя`, value: `Дата регистрации: ${moment.utc(user.createdTimestamp).format("DD/MM/YYYY")}\nДата присоединения к серверу: ${moment.utc(joinedTimestamp).format("DD/MM/YYYY")}\n` },
            )
            .setTimestamp()
            .setFooter({ text: defaultFooterText, iconURL: defaultFooterIcon });
        await interaction.reply({ embeds: [modEmbed], ephemeral: true, components: [buttonsRow] });
	},
};