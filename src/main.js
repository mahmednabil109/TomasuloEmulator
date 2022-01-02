import Logger from './utils/Logger';
import Adder from './components/Adder';
import Clk from './components/Clk';
import '../styles/style.css';
import Parser from './components/Parser';
import Multiplier from './components/Multiplier';
import InstQueue from './components/InstQueue';
import RegFile from './components/RegFile';
import ReserveStations from './components/ReserveStations';
import { ADD, DIV, LOAD, MULT, STORE, SUB } from './constants/Operations';
import Memory from './components/Memory';

let counter = 1;
let clk = new Clk();

let adder = new Adder(4);
let multi = new Multiplier(6);
let memory = new Memory(2);

let regFile = new RegFile();
let adderRS = new ReserveStations(3, [ADD, SUB], adder);
let multiRS = new ReserveStations(2, [MULT, DIV], multi);
// we need to handle memory
let loadRS = new ReserveStations(2, [LOAD], memory);
let storeRS = new ReserveStations(2, [STORE], memory);
let instQueue = new InstQueue(adderRS, multiRS, loadRS, storeRS, regFile);
let parser = new Parser(
  `
  MUL R3,R1,R2
  ADD R5,R3,R4
  ADD R7,R2,R9
  ADD R10,R8,R9
  MUL R11,R7,R10
  ADD R5,R5,R11
  `,
  instQueue
);

// init the regfile
for (let i = 1; i < 12; i++) regFile.setRegto(`r${i}`, i);

// connect them
instQueue.output.connect(adderRS.input);
instQueue.output.connect(multiRS.input);
instQueue.output.connect(loadRS.input);
instQueue.output.connect(storeRS.input);

adderRS.output.connect(adder.input);
multiRS.output.connect(multi.input);
loadRS.output.connect(memory.input);
storeRS.output.connect(memory.input);

// simulate the CDB
adder.output.connect(adderRS.input);
adder.output.connect(multiRS.input);
adder.output.connect(loadRS.input);
adder.output.connect(storeRS.input);
adder.output.connect(regFile.input);

multi.output.connect(adderRS.input);
multi.output.connect(multiRS.input);
multi.output.connect(loadRS.input);
multi.output.connect(storeRS.input);
multi.output.connect(regFile.input);

memory.output.connect(adderRS.input);
memory.output.connect(multiRS.input);
memory.output.connect(loadRS.input);
memory.output.connect(storeRS.input);
memory.output.connect(regFile.input);

// connect clk
clk.connect(memory.clk);
clk.connect(adder.clk);
clk.connect(multi.clk);

clk.connect(loadRS.clk);
clk.connect(storeRS.clk);
clk.connect(adderRS.clk);
clk.connect(multiRS.clk);

clk.connect(instQueue.clk);
clk.connect(parser.clk);

clk.connect(regFile.clk);

Logger.log(parser.instructions);
Logger.log(instQueue.instructions);

function log() {
  Logger.log(`clk ${counter++}`);
  Logger.log('\taddRS', adderRS.operations);
  Logger.log('\tadder', adder.operations);
  Logger.log('\tmultRS', multiRS.operations);
  Logger.log('\tmult', multi.operations);
  Logger.log('\tregFile', regFile.dataMap);
}

document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    clk.tick();
    log();
  }
});
