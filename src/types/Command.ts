import { SlashCommandBuilder, CommandInteraction, Client } from 'discord.js'

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction, client?: Client) => Promise<void> ;
}
