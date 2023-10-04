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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const dotenv_1 = __importDefault(require("dotenv"));
const main_menu_1 = require("./menus/main.menu");
const add_task_scene_1 = require("./scenes/add-task.scene");
const db_1 = require("./config/db");
const task_model_1 = require("./models/task.model");
dotenv_1.default.config();
const bot = new telegraf_1.Telegraf(process.env.BOT_TOKEN);
const stage = new telegraf_1.Scenes.Stage([
    add_task_scene_1.addTaskScene
]);
bot.use((0, telegraf_1.session)());
bot.use(stage.middleware());
bot.start((ctx) => {
    console.log(ctx.message.text);
    ctx.reply("Welcome to the bot!", main_menu_1.mainMenu.reply());
});
bot.hears("Tasks", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let tasks = yield task_model_1.Task.find({ telegram_id: ctx.chat.id });
    tasks.forEach((task) => {
        ctx.reply(`<strong>Title:</strong> ${task.title}\n<strong>Description:</strong> ${task.description}\n<strong>Date:</strong> ${task.date}\n`, {
            parse_mode: 'HTML'
        });
    });
}));
bot.hears("New Task", (ctx) => {
    ctx.scene.enter("add-task");
});
(0, db_1.connectDB)().then(() => {
    console.log("Database has been connecre");
    bot.launch();
});
