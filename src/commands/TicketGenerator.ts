import { CommandInteraction, Client, Message } from 'discord.js'
import { Configuration, OpenAIApi } from 'openai'
import { Command } from '../types/Command'
import { GPT_API_KEY } from '../config/config'

const configuration = new Configuration({
  apiKey: GPT_API_KEY,
})
const openai = new OpenAIApi(configuration)

function generateTicketCreatorPrompt(conversation: string) {
  return `You are the most experienced product manager of a tech company. Structure the response in the following sections that will be used as a GitHub ticket. The GitHub ticket should contain all the necessary information for a developer, a product manager or a quality assurance tester to understand the problem, the solution and the QA process.
    1. Give a title that summarizes the issue. 
    2. Problem Statement: Give a problem statement that summarizes the issues outlined in the conversation. Describe the problem.
    3. Solution: Describe the desired solution agreed upon.
    4. Alternatives: Describe some alternatives that were discussed or propose some or just say 'N/A' if no alternatives should be offered.
    5. Additional context: Summarize any additional context from the conversation.
    6. QA process: Summarize how a QA should test that the solution solves the problem.     
    Please follow these requirements:
    - Be as consice as possible without losing information
    - If there are any missing information, prompt for additional information where you are lacking otherwise, reply with "I have all the information needed!". 
    Here is the information given to you: ${conversation}`
}

async function generateGitHubTicket(conversation: string) {
  if (!configuration.apiKey) {
    throw new Error(
      'OpenAI API key not configured, please follow instructions in README.md',
    )
  }

  if (conversation.trim().length === 0) {
    throw new Error('Please enter valid information or conversation')
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generateTicketCreatorPrompt(conversation),
      temperature: 0.7,
      max_tokens: 1,
    })
    
    return completion.data.choices[0].text
  } catch (error: any) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data)
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
    }

    return 'error occured'
  }
}

// Command to generate a GitHub Ticket
export default {
  name: 'gtc-generate-ticket',
  description: 'Generate a GitHub Ticket based on the Discord conversation',
  run: async (client: Client, interaction: CommandInteraction) => {
    // Find the channel where the conversation took place
    const channel = await client.channels.cache.get('1096935842976641067')

    if (channel && channel.isTextBased()) {
      // Fetch the messages in the channel and concatenate them into a single string
      const messages = await channel.messages.fetch({ limit: 25 })
      let conversation = ''
      messages.forEach((message: Message<true> | Message<false>) => {
        conversation += `${message.content} \n `
      })
      // Pass the messages from Discord to ChatGPT to create a response
      // based on the generateGitHubTicket prompt
      const alfredResponse = await generateGitHubTicket(conversation)

      await interaction.followUp({
        ephemeral: true,
        content: alfredResponse,
      })
    }
  },
} as Command
