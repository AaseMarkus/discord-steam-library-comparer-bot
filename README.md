# discord-steam-library-comparer-bot

This is a discord bot that returns a list of common steam games shared between given users. The running instance of the bot is currently not public, so if you want to use the it you have to add the code to your own bot. (See "how to set up")
The bot is written in node.js and uses the discord.js module and the steam api, as well as a MongoDB database to store user information.

# How To Set Up
1. Register a discord application on https://discord.com/developers/applications and add a Bot in the Bot tab.
2. Get a steam API Key from https://steamcommunity.com/dev/apikey
3. Set up a MongoDB database on https://www.mongodb.com/ and get an admin password for your database
4. Create a file called .env based on .env_sample and replace the placeholder text with your discord bot token, steam API key and MongoDB admin password
5. Replace the MongoDB link in mongoose.js with your own database link
6. You can now start the bot with the command `node index.js` in the terminal
7. The bot should probably be hosted on some sort of server. https://www.heroku.com/ is good free option.

If you want the bot to use a different prefix for commands you can edit the text in prefix.txt.

# Commands
- `<help` sends a private message with all available commands
- `<help [command name]` gives information about the given command
- `<games [user1] [user2] [...optional other users]` returns a list of shared steam games between given users
- `<link [steam id] [optional user]` links a steam account to a discord account so their steam id doesn't have to be used. If no user is given it will link to whoever wrote the command
- `<steam [optional user]` returns the steam id a user is linked to. If no user is given it will return the steam id of whoever wrote the command
- `<unlink [...optional list of users]` unlinks a discord account from their steam account. If no users are given it will unlink whoever wrote the command
- `<version` returns the current version of the bot
