import Logger from './utils/Logger';
import Adder from './components/Adder';
import Clk from './components/Clk';
import Register from './components/Register';
import '../styles/style.css';
import Output from './utils/Ouptut';

let clkBtn = document.querySelector('.btn');
let adder = new Adder();
let clk = new Clk();
let output1 = new Output(),
  output2 = new Output();
let reg1 = new Register(),
  reg2 = new Register(),
  reg3 = new Register();

output1.connect(reg1.input);
output2.connect(reg2.input);

reg1.output.connect(adder.input1);
reg2.output.connect(adder.input2);

adder.output.connect(reg3.input);

output1.load(20);
output2.load(30);

clk.connect(reg3.clk);
clk.connect(reg2.clk);
clk.connect(reg1.clk);

clkBtn.addEventListener('click', () => {
  clk.tick();
  Logger.log('tick');
  Logger.log('\t reg1', reg1.data);
  Logger.log('\t reg2', reg2.data);
  Logger.log('\t adder', adder.output.data);
  Logger.log('\t reg3', reg3.data);
});
