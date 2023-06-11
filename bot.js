const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, EmbedBuilder, Partials } = require('discord.js');
const { token, devGuildId, startRoleId, defaultFooterText, defaultFooterIcon } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions], partials: [Partials.Message, Partials.Channel, Partials.Reaction] });

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
			client.user.setActivity(`v0.9.2.3`, { type: 0 });
			i++;
			break;
		case 1:
			client.user.setActivity("www.vo1ter.me", { type: 2 });
			i++;
			break;
		case 2:
			i = 0;
			break;
	}
}, 15000)

client.on('guildMemberAdd', (member) => {
	const welcomeEmbed = new EmbedBuilder()
		.setColor(`#00c73c`)
		.setTitle(`Новый пользователь`)
		.setThumbnail(member.displayAvatarURL())
		.addFields(
			{ name: `Новый пользователь`, value: `Приветствуем ${member} на сервере!\nОзнакомьтесь с правилами: <#1113997896564621343>\nДля выбора ролей, нажмите на кнопку "Каналы и роли" вверху списка каналов.` },
		)
		.setImage("https://cdn.vo1ter.me/msedge_iKH9n6Wb7a.png")
		.setTimestamp()
		.setFooter({ text: defaultFooterText, iconURL: defaultFooterIcon });
	welcomeChannel.send({ embeds: [welcomeEmbed] })
	member.edit({ roles: [member.guild.roles.cache.get(startRoleId)] })
});

client.on('guildMemberRemove', (member) => {
	const goodbyeEmbed = new EmbedBuilder()
		.setColor(`#ff483b`)
		.setTitle(`Пользователь вышел`)
		.setThumbnail(member.displayAvatarURL())
		.addFields(
			{ name: `Пользователь вышел`, value: `${member} покинул сервер.` },
		)
		.setTimestamp()
		.setFooter({ text: defaultFooterText, iconURL: defaultFooterIcon });

	welcomeChannel.send({ embeds: [goodbyeEmbed] })
});

// client.on('guildUpdate', (oldServer, newServer) => {
// 	const boostEmbed = new EmbedBuilder()
// 		.setColor(`#f47fff`)
// 		.setTitle(`Буст`)
// 		.setThumbnail(member.displayAvatarURL())
// 		.addFields(
// 			{ name: `Пользователь забустил сервер`, value: `${member} забустил сервер!` },
// 		)
// 		.setTimestamp()
// 		.setFooter({ text: defaultFooterText, iconURL: defaultFooterIcon });

// 	if(oldServer.premiumSince && !newServer.premiumSince) {
// 		welcomeChannel.send({ embeds: [boostEmbed] })
// 	}
// });

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