const package = require('../package.json')

module.exports = {
    name: 'version',
    aliases: ['v'],
    description: 'Gives the current version of the bot',
    cooldown: 5,
    execute(message, args, steam) {
        message.channel.send(`steam library comparer version ${package.version}`);
    }
}