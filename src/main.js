import Logger from './utils/Logger';
import Adder from './components/Adder';
import Clk from './components/Clk';
import Register from './components/Register';
import '../styles/style.css';
import Output from './utils/Ouptut';
import Parser from './components/Parser';

let clk = new Clk();
let parser = new Parser(
  `
  LD R6,32(R2)
  LD R2,44(R3)
  MUL R0,R2,R4
  SUB R8,R2,R6
  DIV R10,R0,R6
  ADD R6,R8,R2`,
  null
);

Logger.log(parser.instructions);

document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') clk.tick();
});
