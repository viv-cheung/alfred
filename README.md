# 🎩 Alfred, Your Devoted GitHub Butler
Greetings! I am Alfred, your dependable and courteous GitHub butler, at your service. 🤵 My purpose is to ease your workload by perusing your Discord conversations and creating detailed GitHub issues for you, complete with labels. Simply invoke `/create-issue-ai`, and leave the rest to me.

# 🧐 What Can Alfred Do?
As your devoted butler, my current tasks revolve around helping you create detailed GitHub issues to the best of my abilities.

## `/create-issue-ai`
You may request that I review all messages in a conversation, starting from the message with the URL you provide. I shall examine the messages and summarize my findings in a GitHub ticket.

### Discord Messages
I will review all messages from the provided message URL up to the present. I can automatically include images if needed and understand references to other GitHub messages.

### Labels
I will automatically label tickets based on the available labels in your repository. Please ensure that each label in your repository has a clear and useful definition, as I will attempt to assign labels based on their definitions and the issue at hand.

### Images
While GPT-4 does not *yet* comprehend images as humans do, rendering me effectively blind, I can still include them in the ticket's appendix as references, in case they contain useful information for readers.

## `/create-issue-manual`
Should you prefer to create an issue manually, I shall gladly comply. Simply provide the title and content of the issue, and I shall dutifully create the ticket for you.

# 🚀 How to Run
To have your very own Alfred Discord bot, please follow these steps:

1. Git clone this repository.
2. Run `yarn` or `npm install` to install dependencies.
3. Duplicate the config sample file `src/config/config.sample.ts` and rename the copy to `src/config/config.ts`.
4. Add your Discord bot token and chat GPT API key into your `config.ts` file.
5. Run `yarn start` or `npm start` to activate the bot.

# How to setup?
To setup your github and discord bot properly, follow these steps:

1. Create a github app (e.g. https://github.com/apps/ai-alfred)
2. Copy the Github app ID and Github App Client ID (e.g. https://github.com/settings/apps/ai-alfred) and put it in your .env
3. Create a new github app client secret for your github app (e.g. in https://github.com/settings/apps/ai-alfred) and copy it in your .env file
4. Create a new private key for your github app (e.g. in https://github.com/settings/apps/ai-alfred at the bottom) and copy it in your .env file
5. Install the github app on the repository you want the issues to be created
6. Copy the github app installion ID (you can find it [here](https://github.com/settings/installations)) and put it in your .env
7. Create a discord bot and add it to your server ; 
7.1 Go to https://discord.com/developers/applications
7.2 Click `New application` (top right)
7.3 Name and create your bot 
7.4 Go to `Bot` section and under `Privileged Gateway Intents`, turn on `PRESENCE INTENT`, `SERVER MEMBERS INTENT` and `MESSAGE CONTENT INTENT` 
7.5 Go to `OAuth2/URL Generator`
7.6 Under `scopes`, select `bot`
7.7 Under `BOT PERMISSIONS` select everything under the `TEXT PERMISSIONS`
7.8 Copy and paste URL at the bottom in your browser search bar and add bot to your server
8. In `CreateIssue.ts` and `TicketGenerator.ts`, modify the github repository username and repo name.

# 📋 Automatically Assign Issues to a GitHub Project
If you desire Alfred to automatically assign issues to a specific GitHub Project, kindly create an [Auto Add Workflow](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically#configuring-the-auto-add-workflow-in-your-project) in your project:

1. Go to `github.com/users/USER_NAME/PROJECT_NAME/1/workflows`.
2. In the **Default Workflow** tab, click on **Auto-add to project**.
3. Click Edit, located at the top right.
4. Select `is:issue is:open` if you wish for every created issue to be automatically added to your project.
5. Click **Save and turn on workflow**.