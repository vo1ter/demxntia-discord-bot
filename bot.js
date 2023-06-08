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
	// i'll use it when i'll figure out how to work with functions that contains other functions
	// global.reactions = {
	// 	games: { 
	// 		csgo: "",
	// 		apex: "",
	// 		valorant: "",
	// 		squad: "", 
	// 		dayz: ""
	// 	},
	// 	ranks: {
	// 		valorant: {
	// 			immortal: "1114691816067969034",
	// 			radiant: "1114691823399612567",
	// 			diamond: "1114691811152253119",
	// 			platinum: "1114691820744613908",
	// 			gold: "1114691813291339977",
	// 			bronze: "1114691809629704272",
	// 			iron: "1114691819016560691",
	// 			silver: "1114691824792109167"
	// 		},
	// 		csgo: {
	// 			lvlthree: "1114690377849503875",
	// 			lvlfour: "1114690379548201030",
	// 			lvlfive: "1114690382186418306",
	// 			lvlsix: "1114690383675400312",
	// 			lvlseven: "1114690386389106759",
	// 			lvleight: "1114691490485112872",
	// 			lvlnine: "1114690390113669183",
	// 			lvlten: "1114690391598440508"
	// 		}
	// 	}
	// }

	global.reactions = {
		games: { 
			csgo: "",
			apex: "",
			valorant: "",
			squad: "", 
			dayz: ""
		},
		valorantRanks: {
			immortal: "1114691816067969034",
			radiant: "1114691823399612567",
			ascendant: "1114691806706274304",
			diamond: "1114691811152253119",
			platinum: "1114691820744613908",
			gold: "1114691813291339977",
			bronze: "1114691809629704272",
			iron: "1114691819016560691", 
			silver: "1114691824792109167"
		},
		csgoRanks: {
			lvlthree: "1114690377849503875",
			lvlfour: "1114690379548201030",
			lvlfive: "1114690382186418306",
			lvlsix: "1114690383675400312",
			lvlseven: "1114690386389106759",
			lvleight: "1114691490485112872",
			lvlnine: "1114690390113669183",
			lvlten: "1114690391598440508"
		}
	}

	global.rolesId = {
		games: { 
			csgo: "1114010980507189279",
			apex: "1114011215992193125",
			valorant: "1114011481562939475",
			squad: "1114708186792992868", 
			dayz: "1115627236779905104"
		},
		valorantRanks: {
			immortal: "1114028935454412810",
			radiant: "1114028937983578133",
			ascendant: "1114030063474712637",
			diamond: "1114028933185286164",
			platinum: "1114028930458980354",
			gold: "1114028928126963764",
			bronze: "1114028918522003568",
			iron: "1114028903724490825",
			silver: "1114028925056721006"
		},
		csgoRanks: {
			lvlthree: "1114027936094363708",
			lvlfour: "1114027955883081729",
			lvlfive: "1114027958898798712",
			lvlsix: "1114027961360842844",
			lvlseven: "1114027963927777400",
			lvleight: "1114027966373052497",
			lvlnine: "1114027971527848017",
			lvlten: "1114027968558280778"
		}
	}

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
			client.user.setActivity(`v0.9.2.1`, { type: 0 });
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

client.on('guildUpdate', (oldServer, newServer) => {
	const boostEmbed = new EmbedBuilder()
		.setColor(`#f47fff`)
		.setTitle(`Буст`)
		.setThumbnail(member.displayAvatarURL())
		.addFields(
			{ name: `Пользователь забустил сервер`, value: `${member} забустил сервер!` },
		)
		.setTimestamp()
		.setFooter({ text: defaultFooterText, iconURL: defaultFooterIcon });

	if(oldServer.premiumSince && !newServer.premiumSince) {
		welcomeChannel.send({ embeds: [boostEmbed] })
	}
});

client.on('messageReactionAdd', (messageReaction, user) => {
	// searchReactionId:
	// for(i = 0; i < Object.keys(reactions).length; i++) {
	// 	for(ib = 0; ib < Object.values(Object.values(reactions)[i]).length; ib++) {
	// 		if(Object.values(Object.values(reactions)[i])[ib] == messageReaction) {
	// 			const roleId = Object.values(Object.values(reactions)[i])[ib]
	// 			break searchReactionId;
	// 		}
	// 	}
	// }

	// searchRoleId:
	// for(i = 0; i < Object.keys(rolesId).length; i++) {
	// 	for(ib = 0; ib < Object.values(Object.values(rolesId)[i]).length; ib++) {
	// 		if(Object.values(Object.values(rolesId)[i])[ib] == messageReaction) {
	// 			const roleId = Object.values(Object.values(rolesId)[i])[ib]
	// 			break searchRoleId;
	// 		}
	// 	}
	// }
});

client.on('messageReactionRemove', (messageReaction, user) => {
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