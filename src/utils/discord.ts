import { ChatInputCommandInteraction, Client, InteractionReplyOptions } from 'discord.js'

// Regex for discord messages
// e.g. https://discord.com/channels/1095842976/10969358/11023650
const messageUrlRegex = /https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/

// Will get the message from a discord message URL
export async function getMessageFromURL(client: Client, url: string | null) {
  if (!url) throw new Error("Message URL can't be undefined")

  const matches = url.match(messageUrlRegex)

  if (!matches) {
    throw new Error('Invalid message URL. Expected discord/guild_id/channel_id/message_id')
  }

  const [, guildId, channelId, messageId] = matches

  const guild = await client.guilds.cache.get(guildId)
  if (!guild) throw new Error('Server not found')

  const channel = await guild.channels.cache.get(channelId)
  if (!channel) throw new Error('Channel not found')
  if (!channel.isTextBased()) throw new Error('Channel is not text based')

  const message = await channel.messages.fetch(messageId)
  if (!message) throw new Error('Message not found')

  return message
}

// Replace all discord message URLs with their actual message content
export async function replaceMessageUrls(client: Client, conversation: string): Promise<string> {
  const replacer = async (match: string) => {
    const message = await getMessageFromURL(client, match)
    return message.content
  }

  // Handle all message fetching in parallel
  async function replaceAsync(str: string, regex: RegExp, asyncFn: Function): Promise<string> {
    const globalRegex = new RegExp(regex.source, `${regex.flags}g`)
    const matches = Array.from(str.matchAll(globalRegex))
    const replacements = await Promise.all(matches.map((match) => asyncFn(match[0])))
    return matches.reduce((result, match, i) => result.replace(match[0], `(((reference to an other message: ${replacements[i]})))`), str)
  }

  // Return conversation with replaced URLs
  const replacedConversation = await replaceAsync(conversation, messageUrlRegex, replacer)
  return replacedConversation
}

// To mention users in reply messages
export function mentionUser(userID: string) {
  return `<@${userID}>`
}

// Logic to simplify whether to use a reply or followup message
export async function replyOrFollowup(
  interaction: ChatInputCommandInteraction,
  isReply: boolean,
  reply: InteractionReplyOptions,
) {
  (isReply ? interaction.reply : interaction.followUp).bind(interaction)(reply)
}
