const Discord = require('discord.js');
const Userlink = require('../models/userlink');
const arrayConverter = require('../functions/convertArrayToString');
const sharedInArrays = require('../functions/sharedInArray');

module.exports = {
    name: 'games',
    description: 'Compares common steam games between users given',
    args: true,
    minargs: 2,
    usage: '<user1> <user2> <optional other users>',
    aliases: ['compare', 'g', 'c'],
    execute(message, args, steam) {
        //Takes arguments after command and adds them to user array
        let userString = arrayConverter.execute(args);
        let regex = /<@![0-9]*>/g //REGEX for discord tag


        //Add to const variable and run rest of code using then
        const addUsers = async input => {
            let users = [];

            for(let i = 0; i < args.length; i++)
            {
                if(!(args[i].match(regex))) users.push(args[i]);
                else
                {
                    let dID = args[i].slice(3, -1);
                    
                    if(!(await Userlink.exists({ discordID: `${dID}` }))) message.channel.send(`${args[i]} is not linked to a steam account. Please use their steam id, or link this account using the link command`);
                    else users.push((await Userlink.findOne({ discordID: `${dID}` }, 'steamID').exec()).steamID); 
                }
            }

            return users
        }
        
        

        addUsers().then(users => {
            if(users.length===args.length)
            {
                //Adds games to gamesList array
                const addGames = async input => {
                    let gamesList = [];

                    for (let i = 0; i < users.length; i++) {
                        const id = await steam.resolve(`https://steamcommunity.com/id/${users[i]}`);
                        gamesList.push(steam.getUserOwnedGames(id));
                    }
                    return await Promise.all(gamesList);
                }

                //Handles games output
                addGames().then(gamesList => {
                    message.channel.startTyping();

                    //Changes list of game object to list of game names
                    gamesList.forEach((element, index) => {
                        gamesList[index] = gamesList[index].map((game) => {
                            return game.name;
                        })
                    });

                    //Sorts the array of games from least games to most games
                    gamesList.sort(function (a, b) {
                        return a.length - b.length;
                    });

                    let sharedGames = sharedInArrays.execute(gamesList);


                    //Add shared games to string
                    let output = [""];
                    let counter = 0;
                    let maxLength = 1800;

                    //Adds games to gamesString array
                    sharedGames.forEach(game => {
                        //Move text to new page if character limit is hit
                        if (output[counter].length > maxLength) {
                            counter++;
                            output[counter] = "";
                        }
                        output[counter] += `${game} \n`;
                    })

                    output.forEach((games, index) => {
                        let page = index + 1;

                        const embed = new Discord.MessageEmbed()
                            //.setTitle(`Steam games shared between ${userString}`)
                            .setColor(0xffffff)
                            .setFooter(`Page ${page} of ${output.length}`)
                            .setDescription(`**Steam games shared between ${userString}** \n\n` + games);
                        message.channel.send(embed);
                    })

                    message.channel.stopTyping();
                }).catch(err => {
                    message.channel.stopTyping();
                    message.channel.send("An error has occured, make sure usernames/IDs are correct");
                    console.error(err)
                })
            }
        });
    }
}