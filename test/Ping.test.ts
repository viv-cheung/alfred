import { group, test, beforeStart, afterAll, expect } from "corde";
import { bootAlfred } from "../src/bot"
import { Client } from "discord.js";

// Alfred's client instance
let client: Client

beforeStart(async () => {
  client = await bootAlfred(true);
});

group("Commands", () => {
  test("Ping command should return pong'", () => {
    expect("ping").toReturn("pong");
  });
});

afterAll(() => {
  client.destroy();
});