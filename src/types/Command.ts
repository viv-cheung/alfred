import { SlashCommandBuilder, CommandInteraction, Client, Message } from 'discord.js'

export interface Command {
  data: SlashCommandBuilder;
  execute: (client: Client, interaction: CommandInteraction | Message) => Promise<void> ;
}
