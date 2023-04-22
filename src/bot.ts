import { Client } from 'discord.js'
import { DISCORD_BOT_TOKEN } from './config/config'
import ready from './listeners/ready'
import interactionCreate from './listeners/interactionCreate'
import messageCreate from './listeners/messageCreate'

export const bootAlfred = async (isTest: boolean): Promise<Client> => {
  // Create client
  const client = new Client({ intents: ['Guilds', 'GuildMessages'] })

  // Ready the client
  await ready(client)

  // Listen to interactions
  await interactionCreate(client)

  // Only listen to message commands if in test mode
  if (isTest) {
    await messageCreate(client)
  }

  // Login bot
  await client.login(DISCORD_BOT_TOKEN)

  // Return client
  return client
}

// Booting up
bootAlfred(false)
