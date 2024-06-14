"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const js_1 = __importDefault(require("@squadco/js"));
const squad = new js_1.default(process.env.NEXT_SQUAD_PUBLIC_KEY, process.env.NEXT_SQUAD_PRIVATE_KEY, "development");
exports.default = squad;
