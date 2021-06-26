/*
 * Global config file
 * Stores a map of guilds, each with
 * - _id (String, unique Discord ID)
 * - prefix (String, prefix for commands)
 * - notificationChannelId (String, ID of channel to send messages to)
 * - cronSchedule (String, cron representation of when to send reminders)
 * - cronJob (cron.ScheduledTask, a scheduled task using the node-cron package)
 *
 * Nearly all the properties of a guild object are populated by an initial call to the database on bot startup, except cronJob. This is generated on startup with a helper function that takes notifactionChannelId and cronSchedule to create a cron.ScheduledTask.
 */
module.exports = {
  guilds: {},
};
