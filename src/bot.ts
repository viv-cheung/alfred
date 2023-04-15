import { Client, Intents } from 'discord.js';
import { config } from 'src/config/config'

const client = new Client({ intents: [Intents.FLAGS.Guilds, Intents.FLAGS.GuildMessages] });

const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const COMMAND = '/gtc';

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('messageCreate', (message) => {
  if (message.content === COMMAND) {
    message.channel.send('hello');
  }
});

client.login(BOT_TOKEN);
