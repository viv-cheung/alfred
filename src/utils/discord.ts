import { ChatInputCommandInteraction, Client, InteractionReplyOptions } from 'discord.js'

export async function getMessageFromURL(client: Client, url: string | null) {
  if (!url) throw new Error("Message URL can't be undefined")

  // Regex for discord messages
  // e.g. https://discord.com/channels/1095842976/10969358/11023650
  const regex = /https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/
  const matches = url.match(regex)

  // If we have a match, get message, else throw
  if (!matches) {
    throw new Error(
      'Invalid message URL. Expected discord/guild_id/channel_id/message_id',
    )
  }

  // Extract each ID from URL
  const guildId = matches[1]
  const channelId = matches[2]
  const messageId = matches[3]

  // Get Server
  const guild = await client.guilds.cache.get(guildId)
  if (!guild) throw new Error('Server not found')

  // Get Channel
  const channel = await guild.channels.cache.get(channelId)
  if (!channel) throw new Error('Channel not found')
  if (!channel.isTextBased()) throw new Error('Channel is not text based')

  // Get actual message
  const message = await channel.messages.fetch(messageId)
  if (!message) throw new Error('Message not found')
  return message
}

export function mentionUser(userID: string) {
  return `<@${userID}>`
}

export async function replyOrFollowup(
  interaction: ChatInputCommandInteraction,
  isReply: boolean, 
  reply: InteractionReplyOptions
) {
  (isReply ? interaction.reply : interaction.followUp).bind(interaction)(reply)
}