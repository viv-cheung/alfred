import { Client, GatewayIntentBits } from 'discord.js'
import { DISCORD_BOT_TOKEN } from './config/config'
import ready from './listeners/ready'
import interactionCreate from './listeners/interactionCreate'

console.log('Initiating bot ...')

// Create client
const client = new Client({
  intents: [GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent],
})

// Ready the client
ready(client)

// Listen to interactions
interactionCreate(client)

// Login bot
client.login(DISCORD_BOT_TOKEN)
