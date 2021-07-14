const Userlink = require('../models/userlink');
const mongoose = require('mongoose');

module.exports = {
    name: 'link',
    description: 'Links a steam account to a discord account',
    args: true,
    minargs: 1,
    usage: '<steam id> <optional user>',
    aliases: ['l'],
    execute(message, args, steam) {
        //Add check for admin

        //Link to yourself
        if(args.length===1) uploadToDatabase(message.author.id, args[0]);
        //Link a different user
        else
        {
            let regex = /<@![0-9]*>/g //REGEX for discord tag
            if(!(args[1].match(regex))) message.reply(`${args[1]} is not a user tag`);
            else
            {
                let dID = args[1].slice(3, -1);
                uploadToDatabase(dID, args[0]);
            }
        }

        function uploadToDatabase(dID, sID)
        {
            Userlink.exists({ discordID: `${dID}`}).then(exists => {
                //Uploads discord id and steam id to database if it doesnt already exist
                if (!exists)
                {
                    const userlink = new Userlink({
                        _id: new mongoose.Types.ObjectId(),
                        discordID: dID,
                        steamID: sID
                    });

                    userlink.save().then(result => {
                        message.channel.send(`<@!${dID}> has been linked to steam user ${sID}`);
                    }).catch(err => {
                        console.log(err);
                        message.reply("An error has occured while trying to link account");
                    });
                }
                //Changes steamid of already existing user in database
                else
                {
                    Userlink.findOneAndUpdate({ discordID: `${dID}` }, { steamID: `${sID}`}).then(result => {
                        message.channel.send(`<@!${dID}> has been linked to steam user ${sID}`);
                    }).catch(err => {
                        console.log(err);
                        message.reply("An error has occured while trying to link account");
                    }); 
                }
            })
        }
    }
}