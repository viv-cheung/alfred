import { Command } from "./types/Command";
import Ping from "./commands/Ping";
import TicketGenerator from "./commands/TicketGenerator";

// List of all commands available to the bot
export default [Ping, TicketGenerator] as Command[];
