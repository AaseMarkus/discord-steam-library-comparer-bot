const Userlink = require('../models/userlink');

module.exports = {
    name: 'steam',
    description: 'Outputs the steam account a user is linked to',
    usage: '<optional user>',
    aliases: ['s'],
    execute(message, args, steam)
    {
        if(args.length===0) getSteam(message.author.id)
        else if(args.length>0)
        {
            let regex = /<@![0-9]*>/g //REGEX for discord tag
            if(!(args[0].match(regex))) message.reply(`${args[0]} is not a user tag`);
            else 
            {
                let dID = args[0].slice(3, -1);
                getSteam(dID)
            }
        }

        async function getSteam(dID)
        {
            Userlink.exists({ discordID: `${dID}`}).then( async exists => {
                if(exists) Userlink.findOne({ discordID: `${dID}`}, 'steamID').exec().then(result => message.channel.send(`<@!${dID}> is linked to ${result.steamID}`))
                else message.channel.send(`<@!${dID}> is not linked to any accounts`)
            });
        }
    }
}