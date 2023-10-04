"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTaskScene = void 0;
const telegraf_1 = require("telegraf");
const task_model_1 = require("../models/task.model");
const titleStep = new telegraf_1.Composer();
const descriptionStep = new telegraf_1.Composer();
const dateStep = new telegraf_1.Composer();
const confirmStep = new telegraf_1.Composer();
titleStep.on("text", (ctx) => {
    ctx.wizard.state.title = ctx.message.text;
    ctx.reply("Please provide a description for your task");
    return ctx.wizard.next();
});
descriptionStep.on("text", (ctx) => {
    ctx.wizard.state.description = ctx.message.text;
    ctx.reply("Please provide a date for your task");
    return ctx.wizard.next();
});
dateStep.on('text', (ctx) => {
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
    ctx.wizard.next();
});
confirmStep.action("discard", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.reply("Task has been discarded!");
    ctx.scene.leave();
}));
confirmStep.action("confirm", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    task_model_1.Task.create({
        telegram_id: ctx.chat.id,
        title: ctx.wizard.state.title,
        description: ctx.wizard.state.description,
        date: ctx.wizard.state.date
    });
    ctx.reply("Task has been added!");
    ctx.scene.leave();
}));
exports.addTaskScene = new telegraf_1.Scenes.WizardScene("add-task", titleStep, descriptionStep, dateStep, confirmStep);
exports.addTaskScene.enter((ctx) => {
    ctx.reply("Please provide a title for your task");
});
