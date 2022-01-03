import { ADD, DIV, LOAD, MULT, STORE, SUB } from './constants/Operations';
import Adder from './components/Adder';
import Clk from './components/Clk';
import Parser from './components/Parser';
import Multiplier from './components/Multiplier';
import InstQueue from './components/InstQueue';
import RegFile from './components/RegFile';
import ReserveStations from './components/ReserveStations';
import Memory from './components/Memory';
import './ui/frontend';
import {
  adderEl,
  addRsEl,
  loadEl,
  memoryEl,
  multiEl,
  multiRsEl,
  queueEl,
  regFileEl,
  soterEl,
} from './ui/frontend';
import '../styles/style.css';

let clkNumEl = document.querySelector('#clkNum');
let clkBtn = document.querySelector('#clk-btn');
let startBtn = document.querySelector('#start-btn');

let counter = 1;
let clk = new Clk();

// handle clk
clkBtn.addEventListener('click', () => {
  clkNumEl.innerHTML = counter++;
  clk.tick();
});

// handle start
startBtn.addEventListener('click', () => {
  let code = document.querySelector('#code-area').value;

  let addLatency = +document.querySelector('#add-latency').value;
  let multiLatency = +document.querySelector('#multi-latency').value;
  let dividerLatency = +document.querySelector('#divider-latency').value;
  let loadLatency = +document.querySelector('#load-latency').value;

  let addSize = +document.querySelector('#add-size').value;
  let multiSize = +document.querySelector('#multi-size').value;
  let loadSize = +document.querySelector('#load-size').value;
  let storeSize = +document.querySelector('#store-size').value;

  initCPU({
    code,
    addLatency,
    multiLatency,
    dividerLatency,
    loadLatency,
    addSize,
    multiSize,
    loadSize,
    storeSize,
  });

  document.querySelector('#clk-btn').removeAttribute('disabled');
});

function initCPU(data) {
  counter = 1;
  let adder = new Adder(data.addLatency, adderEl);
  let multi = new Multiplier(data.multiLatency, data.dividerLatency, multiEl);
  let memory = new Memory(data.loadLatency, memoryEl);

  let regFile = new RegFile(regFileEl);
  let adderRS = new ReserveStations(data.addSize, [ADD, SUB], adder, addRsEl);
  let multiRS = new ReserveStations(
    data.multiSize,
    [MULT, DIV],
    multi,
    multiRsEl
  );
  // we need to handle memory
  let loadRS = new ReserveStations(data.loadSize, [LOAD], memory, loadEl);
  let storeRS = new ReserveStations(data.storeSize, [STORE], memory, soterEl);
  let instQueue = new InstQueue(
    adderRS,
    multiRS,
    loadRS,
    storeRS,
    regFile,
    queueEl
  );
  let parser = new Parser(data.code, instQueue);

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

  clk.connect(regFile.clk);

  clk.connect(instQueue.clk);
  clk.connect(parser.clk);

  document.querySelector('#reg-set').addEventListener('click', () => {
    let address = document.querySelector('#reg-address').value;
    let value = +document.querySelector('#reg-value').value;
    regFile.setRegto(address, value);
  });

  document.querySelector('#mem-set').addEventListener('click', () => {
    let address = +document.querySelector('#mem-address').value;
    let value = +document.querySelector('#mem-value').value;
    memory.dataMap.set(address, value);
    memory.render();
  });
}

// Logger.log(parser.instructions);
// Logger.log(instQueue.instructions);

// function log() {
//   clkNumEl.innerHTML = `${counter}`;
//   Logger.log(`clk ${counter++}`);
//   Logger.log('\taddRS', adderRS.operations);
//   Logger.log('\tadder', adder.operations);
//   Logger.log('\tmultRS', multiRS.operations);
//   Logger.log('\tmult', multi.operations);
//   Logger.log('\tstoreRS', storeRS.operations);
//   Logger.log('\tmemory', memory.operations);
//   Logger.log('\tmemory', memory.dataMap);
//   Logger.log('\tregFile', regFile.dataMap);
// }

// document.addEventListener('keypress', (e) => {
//   if (e.key === 'Enter') {
//     clk.tick();
//     log();
//   }
// });
