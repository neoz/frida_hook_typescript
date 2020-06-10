"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const frida = require('frida');
const readFile = util_1.default.promisify(fs_1.default.readFile);
let session, script;
let onMessage = function (message, data) {
    if (message.type === 'send') {
        console.log(message.payload);
    }
    else if (message.type === 'error') {
        console.error(message.stack);
    }
};
async function run() {
    const source = await readFile(path_1.default.join(__dirname, '_agent.js'), 'utf8');
    let deviceOptions = { timeout: 10000 };
    const device = await frida.getUsbDevice(deviceOptions);
    session = await device.attach('iTunes');
    script = await session.createScript(source);
    script.message.connect(onMessage);
    await script.load();
}
function onError(error) {
    console.error(error.stack);
}
run().catch(onError);
