import { Client, CommandInteraction } from "discord.js";
import { Command } from "src/types/Command";

export default async function (command: Command, client: Client, interaction: CommandInteraction) {
    try {
      await command.execute(client, interaction);

    } catch (error) {
      console.error(`Error while executing command ${command.data.name}:`, error);

      await interaction.followUp({
        content: `:pensive: *I am terribly sorry, but it seems I've run into some trouble:* **${error}**`,
        ephemeral: true,
      });
    }
  }
  