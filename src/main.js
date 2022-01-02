import Logger from './utils/Logger';
import Adder from './components/Adder';
import Clk from './components/Clk';
import '../styles/style.css';
import Parser from './components/Parser';
import Multiplier from './components/Multiplier';
import InstQueue from './components/InstQueue';
import RegFile from './components/RegFile';
import ReserveStations from './components/ReserveStations';
import { ADD, DIV, MULT, SUB } from './constants/Operations';

let clk = new Clk();

let adder = new Adder(2);
let multi = new Multiplier(3);

let regFile = new RegFile();
let adderRS = new ReserveStations(2, [ADD, SUB]);
let multiRS = new ReserveStations(2, [MULT, DIV]);
let instQueue = new InstQueue(adderRS, multiRS, null, null, regFile);
let parser = new Parser(
  `
  SUB R8,R2,R6
  ADD R9,R8,R6
  MUL R9,R8,R6
  ADD R10,R9,R6
  ADD R11,R2,R6
  `,
  instQueue
);

// init the regfile
regFile.setRegto('r8', 10);
regFile.setRegto('r6', 12);
regFile.setRegto('r2', 20);

// connect them
instQueue.output.connect(adderRS.input);
instQueue.output.connect(multiRS.input);

adderRS.output.connect(adder.input);
multiRS.output.connect(multi.input);

adder.output.connect(adderRS.input);
adder.output.connect(multiRS.input);
adder.output.connect(regFile.input);

multi.output.connect(adderRS.input);
multi.output.connect(multiRS.input);
multi.output.connect(regFile.input);

// connect clk
clk.connect(adder.clk);
clk.connect(multi.clk);
clk.connect(adderRS.clk);
clk.connect(multiRS.clk);
clk.connect(instQueue.clk);
clk.connect(parser.clk);
clk.connect(regFile.clk);

Logger.log(instQueue.instructions);

function log() {
  Logger.log('clk');
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
