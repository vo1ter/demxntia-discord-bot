const fs = require('node:fs');
const path = require('node:path');
const { Client, Intents, Collection, MessageEmbed, ActivityType } = require('discord.js');
const { token, devGuildId } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

// setInterval(function() {
// 	fs.
// }, 1000) // check every second if there are any1 to unmute

client.once('ready', () => {
	client.channels.fetch("1113997726552690859").then(channel => global.welcomeChannel = channel).catch(error => console.log(error))
	// reload commands
	// const guild = client.guilds.cache.get(devGuildId);

	// client.application.commands.set([]);
	// guild.commands.set([]);
	console.log('Ready!');
});

var i = 0;
setInterval(function() {
	switch(i) {
		case 0:
			console.log(i);
			client.user.setActivity(`v0.9.1`, { type: 0 });
			i++;
			break;
		case 1:
			console.log(i);
			client.user.setActivity("www.vo1ter.me", { type: 2 });
			i++;
			break;
		case 2:
			i = 0;
			break;
	}
}, 15000)

client.on('guildMemberAdd', (member) => {
	const welcomeEmbed = new MessageEmbed()
		.setColor(`#00c73c`)
		.setTitle(`Новый пользователь`)
		.setThumbnail(member.displayAvatarURL())
		.addFields(
			{ name: `Новый пользователь`, value: `Приветствуем ${member} на сервере!\nОзнакомьтесь с правилами: <#1113997896564621343>\nВыберите роли: <#1113997980412952716>\nИ если вы играете в CS, Valorant либо Apex Legends, то выберите свою роль: <#1113998312606019584>` },
		)
		.setTimestamp()
		.setFooter({ text: "Designed and coded for DEMXNTIA", iconURL: "https://cdn.vo1ter.me/demxntia.png" });

	welcomeChannel.send({ embeds: [welcomeEmbed] })
	member.edit({ roles: [member.guild.roles.cache.get("1114019659595915364")] })
});

client.on('guildMemberRemove', (member) => {
	const goodbyeEmbed = new MessageEmbed()
		.setColor(`#ff483b`)
		.setTitle(`Пользователь вышел`)
		.setThumbnail(member.displayAvatarURL())
		.addFields(
			{ name: `Пользователь вышел`, value: `${member} покинул сервер.` },
		)
		.setTimestamp()
		.setFooter({ text: "Designed and coded for DEMXNTIA", iconURL: "https://cdn.vo1ter.me/demxntia.png" });

	welcomeChannel.send({ embeds: [goodbyeEmbed] })
});

client.on('guildUpdate', (oldServer, newServer) => {
	const boostEmbed = new MessageEmbed()
		.setColor(`#f47fff`)
		.setTitle(`Буст`)
		.setThumbnail(member.displayAvatarURL())
		.addFields(
			{ name: `Пользователь забустил сервер`, value: `${member} забустил сервер!` },
		)
		.setTimestamp()
		.setFooter({ text: "Designed and coded for DEMXNTIA", iconURL: "https://cdn.vo1ter.me/demxntia.png" });

	if(oldServer.premiumSince && !newServer.premiumSince) {
		welcomeChannel.send({ embeds: [boostEmbed] })
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

    if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'При обработке комманды произошла ошибка!', ephemeral: true });
	}
});

client.login(token);