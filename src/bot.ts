import { Scenes, Telegraf, session } from "telegraf";
import dotenv from "dotenv";
import { mainMenu } from "./menus/main.menu";
import { addTaskScene } from "./scenes/add-task.scene";
import { connectDB } from "./config/db";
import { Task } from "./models/task.model";

dotenv.config();

const bot = new Telegraf<Scenes.WizardContext>(process.env.BOT_TOKEN as string, );

const stage = new Scenes.Stage<Scenes.WizardContext>([
    addTaskScene
]);

bot.use(session());
bot.use(stage.middleware());


bot.start((ctx) => {
    
    console.log(ctx.message.text)
    ctx.reply("Welcome to the bot!", mainMenu.reply())

});

bot.hears("Tasks", async(ctx) => {
   let tasks  = await Task.find({telegram_id: ctx.chat.id})
   tasks.forEach((task: any)=>{
         ctx.reply(`<strong>Title:</strong> ${task.title}\n<strong>Description:</strong> ${task.description}\n<strong>Date:</strong> ${task.date}\n`, {
              parse_mode: 'HTML'
         })
    }
    )

});

bot.hears("New Task", (ctx) => {
    ctx.scene.enter("add-task");
});

connectDB().then(()=>{
    console.log("Database has been connecre")
    bot.launch()
})
