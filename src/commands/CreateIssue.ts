import { ChatInputCommandInteraction } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { getOctokit, createIssue } from '../utils/github'
import { AlfredConfig } from '../config/config'

// TEMPORARY SETTINGS
const OWNER = 'viviankc'
const REPO = 'gtc'

const createIssueCommandData = new SlashCommandBuilder()
  .setName('createissue')
  .setDescription('Create a GitHub issue')
  .addStringOption((option) => option
    .setName('title')
    .setDescription('The title of the issue')
    .setRequired(true))
  .addStringOption((option) => option
    .setName('body')
    .setDescription('The body of the issue'))

// Command to let the bot create a ticket
export default {
  data: createIssueCommandData,
  execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
    const title = interaction.options.getString('title') // Is required
    const body = interaction.options.getString('body') || '' // Can be empty

    const octokit = await getOctokit(AlfredConfig)
    const url = await createIssue(octokit, OWNER, REPO, title!, body)

    interaction.followUp({
      content:
        `
          **GitHub issue created successfully!**\n 
          **Title**: ${title}
          **Content**: ${body}
          **URL**: ${url}
        `,
      ephemeral: true,
    })
  },
}
