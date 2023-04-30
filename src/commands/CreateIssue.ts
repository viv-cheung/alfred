import { ChatInputCommandInteraction, Client } from 'discord.js'
import { SlashCommandBuilder } from '@discordjs/builders'
import { getOctokit, createIssue } from '../utils/github'
import { AlfredGithubConfig } from '../config/config'

// TEMPORARY SETTINGS
const OWNER = 'viviankc'
const REPO = 'gtc'

const createIssueCommandData = new SlashCommandBuilder()
  .setName('create-issue-manual')
  .setDescription('Create a GitHub issue')
  .addStringOption((option) => option
    .setName('title')
    .setDescription('The title of the issue')
    .setRequired(true))
  .addStringOption((option) => option
    .setName('content')
    .setDescription('The body of the issue')
    .setRequired(true))

// Command to let the bot create a ticket
export default {
  data: createIssueCommandData,
  execute: async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    const title = interaction.options.getString('title') // Is required
    const body = interaction.options.getString('body') || '' // Can be empty

    const octokit = await getOctokit(AlfredGithubConfig)
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
