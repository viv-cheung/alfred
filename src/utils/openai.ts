import { Collection, Message } from 'discord.js'

export function addConversation(msg: Message) {
  const attachments = msg.attachments.map((att) => att.url)
  return `${msg.author.username}: ${msg.content} `
    + `${attachments.length > 0 ? `[ATTACHMENTS: ${attachments}]` : ''}]\n`
}

export function stackConversation(
  msgs: Collection<string, Message<true>> | Collection<string, Message<false>>,
) {
  let conversation = ''
  msgs.reverse().forEach((message: Message<true> | Message<false>) => {
    conversation += addConversation(message)
  })
  return conversation
}
