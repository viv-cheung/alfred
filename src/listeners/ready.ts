import { Client } from 'discord.js'
import Commands from '../Commands'

// Check if the client is in a ready state
export default (client: Client): void => {
  client.on('ready', async () => {
    if (!client.user || !client.application) {
      return
    }

    await client.application.commands.set(Commands.map((command) => command.data.toJSON()))
    console.log(`${client.user.username} is online`)
  })
}
