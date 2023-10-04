import { Composer, Scenes } from "telegraf";
import { Task } from "../models/task.model";

const titleStep = new Composer<Scenes.WizardContext>();

const descriptionStep = new Composer();

const dateStep = new Composer();

const confirmStep = new Composer();

titleStep.on("text", (ctx: any) => {
    ctx.wizard.state.title = ctx.message.text;
    ctx.reply("Please provide a description for your task");
    return ctx.wizard.next();
}
);

descriptionStep.on("text", (ctx: any) => {
    ctx.wizard.state.description = ctx.message.text;
    ctx.reply("Please provide a date for your task");
    return ctx.wizard.next();
}
);

dateStep.on('text',(ctx: any)=>{
    ctx.wizard.state.date = ctx.message.text;

    let preview = `<strong>Title:</strong> ${ctx.wizard.state.title}\n<strong>Description:</strong> ${ctx.wizard.state.description}\n<strong>Date:</strong> ${ctx.wizard.state.date}\n`;
    ctx.reply(preview, {
        reply_markup: {
            inline_keyboard: [
                [{
                    text: "Confirm",
                    callback_data: "confirm"
                },
                {
                    text: "Discard",
                    callback_data: "discard"
                }]
            ]
        },
        parse_mode: 'HTML'
    });

    ctx.wizard.next()
})

confirmStep.action("discard", async(ctx: any) => {
    ctx.reply("Task has been discarded!");
    ctx.scene.leave();
}
);

confirmStep.action("confirm", async(ctx: any) => {
    Task.create({
        telegram_id: ctx.chat.id,
        title: ctx.wizard.state.title,
        description: ctx.wizard.state.description,
        date: ctx.wizard.state.date
    })
    ctx.reply("Task has been added!");
    ctx.scene.leave();
}
);



export const addTaskScene = new Scenes.WizardScene(
    "add-task",
    titleStep,
    descriptionStep,
    dateStep,
    confirmStep
);



addTaskScene.enter((ctx: any) => {
    ctx.reply("Please provide a title for your task");
}
);