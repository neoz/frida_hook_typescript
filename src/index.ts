import { Session, Script, GetDeviceOptions, Device,Message,ScriptMessageHandler } from 'frida';
import fs from 'fs';
import path from 'path';
import util from 'util';
const frida = require('frida');

const readFile = util.promisify(fs.readFile);

let session:Session, script:Script

let onMessage:ScriptMessageHandler = function (message: Message, data: Buffer | null){
    if (message.type === 'send') {
      console.log(message.payload);
    } else if (message.type === 'error') {
      console.error(message.stack);
    }
}

async function run() {  
  const source = await readFile(path.join(__dirname, '_agent.js'), 'utf8');

  
  let deviceOptions:GetDeviceOptions = { timeout : 10000 };
  const device:Device = await frida.getUsbDevice(deviceOptions);

  session = await device.attach('iTunes');
  script = await session.createScript(source);    
  script.message.connect(onMessage);
  await script.load();    
}

function onError(error:any) {
  console.error(error.stack);
}

run().catch(onError);