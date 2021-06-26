const cron = require('node-cron');
const config = require('./config');

const startCronJob = async function (client, guildId, notificationChannelId, cronSchedule) {
  // Find channel and schedule the cronJob
  client.channels.fetch(notificationChannelId)
    .then((channel) => {
      console.log(`Scheduling cronJob for guild ${guildId} with cronSchedule ${cronSchedule}`);
      const task = cron.schedule(cronSchedule, () => {
        channel.send(`Remember to stay hydrated! \nReact with 💧 in the next 5 minutes if you drank some water!`).then(msg => {
          msg.react('💧');
          const filter = reaction => reaction.emoji.name === '💧';
          const collector = msg.createReactionCollector(filter, { time: 5 * 60 * 1000 });
          collector.on('collect', reaction => console.log(`Collected ${reaction.emoji.name}`));
          collector.on('end', collected => console.log(`Collected ${collected.size} items`));
        });
      });

      // Destroy any previously existing cronJob
      const existingTask = config?.guilds[guildId]?.cronJob;
      if (existingTask) {
        existingTask.destroy();
      }

      // Start the new task and save it to the local config
      task.start();
      config.guilds[guildId] = config.guilds[guildId] || {};
      config.guilds[guildId].cronJob = task;
    }).catch((err) => {
      console.error(err);
    });
};

module.exports = {
  startCronJob,
};
