const Userlink = require('../models/userlink');
const mongoose = require('mongoose');
const arrayConverter = require('../functions/convertArrayToString');

module.exports = {
    name: 'unlink',
    description: 'Unlinks an account from their steam account',
    usage: '<optional list of users>',
    aliases: ['ul'],
    execute(message, args, steam)
    {
        if(args.length===0)
        {      
            deleteFromDB(message.author.id).then(result => {
                if(result) message.channel.send(`<@!${result}> has been unlinked succesfully`);
            })
        }
        else
        {
            let regex = /<@![0-9]*>/g //REGEX for discord tag

            let removedUsers = [];

            const readArgs = async input => {
                for(let i = 0; i < args.length; i++)
                {
                    if(!(args[i].match(regex))) message.reply(`${args[i]} is not a user tag`);
                    else
                    {
                        let dID = args[i].slice(3, -1);
                        await deleteFromDB(dID).then( result => {
                            if(result) removedUsers.push(result);
                        });
                    }
                }
                return removedUsers;
            }
            
            readArgs().then(removedUsers => {
                if(removedUsers.length === 1) message.channel.send(`<@!${removedUsers[0]}> has been unlinked succesfully`);
                else if(removedUsers.length > 1)
                {
                    let output = arrayConverter.execute(removedUsers, "<@!", ">");
                    message.channel.send(`${output} have been unlinked succesfully`)
                }
            })

            
        }

        async function deleteFromDB(dID)
        {
            let removed = false;

            await Userlink.exists({ discordID: `${dID}`}).then(async exists => {
                if(exists)
                {
                    await Userlink.deleteOne({ discordID: `${dID}`}).then(result => {
                        removed = true;
                    }).catch(err => {
                        message.reply(`There was an error while unlinking <@!${dID}>`);
                        console.err(err);
                    })
                }
                else message.channel.send(`<@!${dID}> is not linked to any steam accounts`);
            })
            
            if(removed) return dID;
            else return false;
        }
    }
}