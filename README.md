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

# 📋 Automatically Assign Issues to a GitHub Project
If you desire Alfred to automatically assign issues to a specific GitHub Project, kindly create an [Auto Add Workflow](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically#configuring-the-auto-add-workflow-in-your-project) in your project:

1. Go to `github.com/users/USER_NAME/PROJECT_NAME/1/workflows`.
2. In the **Default Workflow** tab, click on **Auto-add to project**.
3. Click Edit, located at the top right.
4. Select `is:issue is:open` if you wish for every created issue to be automatically added to your project.
5. Click **Save and turn on workflow**.