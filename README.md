# Alfred (your friendly discord butler)


# How to Run
Here are the instructions on how to run your own Alfred Discord bot.

1. Git clone this repository
2. Run `yarn` or `npm install` to install dependencies
3. Copy the config sample file `src/config/config.sample.ts` and rename copy as `src/config/config.ts`
4. Add discord bot token and chat GPT API key into your `config.ts` file
5. run `yarn start` or `npm start` to run the bot


# How to automaticall assign issues to a Github Project
If you want Alfred to automatically assign issues to a specific Github Project, you need to create an [Auto Add Workflow](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically#configuring-the-auto-add-workflow-in-your-project) in your project. 

1. Go to `github.com/users/USER_NAME/PROJECT_NAME/1/workflows`
2. In the **Default Workflow** tab, click on **Auto-add to project**
3. Click Edit, top right
4. You can select `is:issue is:open` if you want every issue created to be automatically added to your project
5. Click **Save and turn on workflow**
