const Discord = require('discord.js');
const SteamAPI = require('steamapi');
const fs = require('fs');
const package = require('./package.json')
const mongoose = require('./utils/mongoose');
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;
const client = new Discord.Client();

const steamkey = process.env.STEAM_KEY;
const steam = new SteamAPI(steamkey);

//Creates Discord collection and adds commands to it
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); //Returns an array of all filenames in ./commands

for(const file of commandFiles) 
{
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

//Reads prefix from file
const PREFIX = fs.readFileSync('prefix.txt', 'utf8');

const cooldowns = new Discord.Collection();

client.on('ready', () => {
    client.user.setActivity(`${PREFIX}help`);
    console.log(`steam library comparer version ${package.version} is online`);
})

//Command handler
client.on('message', message => {
    if(!message.content.startsWith(PREFIX) || message.author.bot) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) return;

    //True if command args: true and message does not include any arguments
    if (command.args && args.length<command.minargs) {
        let reply = `This command requires ${command.minargs} argument(s), ${message.author}`;  

        if(command.usage) {
            reply += `\nThe proper usage would be: \`${PREFIX}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply)
    }

    if(!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection);
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if(timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if(now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`)
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(message, args, steam);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
})

mongoose.init();
client.login(token);
