import { Client } from 'discord.js';
import { config } from './config/config'
import ready  from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";

console.log("Initiating bot ...");

// Create client 
const client = new Client({ intents: [] });

// Ready the client
ready(client)

// Listen to interactions
interactionCreate(client);

// Login bot
client.login(config.DISCORD_BOT_TOKEN);


