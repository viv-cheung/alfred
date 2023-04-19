import { SlashCommandBuilder, CommandInteraction, Client } from 'discord.js'

export interface Command {
  data: SlashCommandBuilder;
  execute: (client: Client, interaction: CommandInteraction) => Promise<void> ;
}
