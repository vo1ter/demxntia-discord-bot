const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js")
const Gamedig = require('gamedig');
const moment = require('moment');
const server = require('./server');
const { defaultFooterText, defaultFooterIcon } = require('../config.json');
moment.locale("ru")

async function pingServer(type, host, attemptedPorts) {
	if(type == "dayz") host[1] = parseInt(host[1]) + 1;
	if(type == "minecraft") host[1] = 25565
	return await Gamedig.query({
		type: type,
		host: host[0],
		port: host[1]
	})
	.then((state) => {
		result = {
			name: state.name,
			map: state.map,
			playersCount: state.players.length - state.bots.length,
			maxPlayers: state.maxplayers,
			address: state.connect,
			ping: state.ping
		}
		return result;
	})
	.catch((error) => {
		attemptedPorts.push(host[1]);
		if(type == "dayz") {
			if(attemptedPorts.includes(host[1]) == true) {
				switch(host[1]) {
					case 2403:
					case 2303:
						host[1] = 27016
						pingServer(type, host, attemptedPorts)
						break;
					case 27016:
						host[1] = host[1] + 1
						pingServer(type, host, attemptedPorts)
						break;
					default:
						console.log(error)
						return "Невозможно связаться с сервером.";
				}
			}
		}
		console.log(error)
		return "Невозможно связаться с сервером.";
	});
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Получить информацию про игровой сервер')
		.addStringOption(option => option
			.setName('ip')
			.setDescription('IP и порт сервера в формате ip:port')
			.setRequired(true))
		.addStringOption(option => option
			.setName('gameid')
			.setDescription('Игра')
			.setRequired(true)
			.addChoices(
				{ name: 'CS:GO', value: 'csgo' },
				{ name: 'DayZ', value: 'dayz' },
				{ name: 'Garry\' Mod', value: 'garrysmod' },
				{ name: 'MTA', value: 'mtasa' },
				{ name: 'Minecraft', value: 'minecraft' },
				{ name: 'Unturned', value: 'unturned' }
			)),
	async execute(interaction) {
		const game = interaction.options.getString("gameid");
		const address = interaction.options.getString("ip");
		if(address.split(":").length != 2 && game != "minecraft") {
			await interaction.reply({ content: "Неверный формат IP!", ephemeral: true});
			return;
		}
		var serverDetails = await pingServer(game, address.split(":"), [])
		if(serverDetails = "Невозможно связаться с сервером.") return await interaction.reply({ content: 'Невозможно получить информацию о сервере! Скорее всего он либо оффлайн, либо бот не смог найти query порт.', ephemeral: true });
		if(serverDetails.map == "" || serverDetails.map == undefined) serverDetails.map = "-"
		const serverInfoEmbed = new MessageEmbed()
            .setColor(`#ff1414`)
            .setTitle(`Информация про ${serverDetails.name}`)
            // .setThumbnail() // картинки дефолт карт сюда плз :)
            .addFields(
                { name: `Общая информация`, value: `Название сервера: ${serverDetails.name}\nКарта: ${serverDetails.map}\nКол-во игроков: ${serverDetails.playersCount}\/${serverDetails.maxPlayers}\nIP: ${serverDetails.address}\nЗадержка (из Helsinki): ${serverDetails.ping}` },
            )
            .setTimestamp()
            .setFooter({ text: defaultFooterText, iconURL: defaultFooterIcon });
        await interaction.reply({ embeds: [serverInfoEmbed] });
	},
};