require('dotenv').config();
const Discord = require('discord.js');
const mongoose = require('mongoose');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const clientCommands = require('./commands');
const config = require('./config');
const Guild = require('./models/Guild');
const Helpers = require('./helpers');

// Connect to MongoDB with Mongoose
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gmyc8.mongodb.net/hydro-pump?retryWrites=true&w=majority`
mongoose.connect(uri, {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.info('MongoDB connected!')
}).catch((err) => {
  console.error('Error connecting to MongoDB')
  console.error(err)
});

// Map commands
Object.keys(clientCommands).map(key => {
  console.log(`Setting up ${clientCommands[key].name}`);
  client.commands.set(clientCommands[key].name, clientCommands[key]);
});

// Startup functions
client.once('ready', () => {
  console.info(`Logged in as ${client.user.tag}!`);

  // Fetch all guilds from database and populate local config
  Guild.find({})
  .then((guilds) => {
    console.info('Populating local config and scheduling cronJobs...');
    guilds.forEach((guild) => {
      if (guild.notificationChannelId && guild.cronSchedule) {
        Helpers.startCronJob(client, guild._id, guild.notificationChannelId, guild.cronSchedule);
      }
      config.guilds[guild._id] = {
        prefix: guild.prefix,
        notificationChannelId: guild.notificationChannelId,
        cronSchedule: guild.cronSchedule,
      };
    });
    console.info('Guilds fetched from database and added to local config');
  }).catch((err) => {
    console.err('Error fetching from database');
    console.err(err);
  });
});

// Message listener
client.on('message', msg => {
  const prefix = config.guilds[msg.guild.id]?.prefix || '!';

  if (msg.content[0] === prefix) {
    const args = msg.content.split(/ +/);
    const command = args.shift().substring(1);

    if (!client.commands.has(command)) {
      msg.channel.send('This command does not exist!')
    } else {
      try {
        client.commands.get(command).execute(msg, args);
      } catch (error) {
        console.error(error);
        msg.reply('There was an error trying to execute that command!');
      }
    }
  }
});

// Start Discord client!
const TOKEN = process.env.TOKEN;
client.login(TOKEN);
