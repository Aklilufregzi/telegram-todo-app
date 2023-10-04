"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
function connectDB() {
    return mongoose_1.default.connect('mongodb://localhost:27017/todo-app');
}
exports.connectDB = connectDB;
