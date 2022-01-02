import Input from '../utils/Input';
import Observer from '../utils/Observer';
import Instruction from '../utils/Instruction';
import {
  ADD,
  ADDI,
  SUB,
  MULT,
  DIV,
  LOAD,
  STORE,
} from '../constants/Operations';

class Parser extends Observer {
  constructor(text, queue) {
    super();
    // array of instructions
    this.instructions = [];
    // clk to issue instruction every clk
    this.clk = new Input(this);
    // program counter
    this.pc = 0;
    // pointer to the instruction queue
    this.queue = queue;
    if (text) this._parse(text);
  }

  _parse(text) {
    this.instructions = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => !!l)
      .map((line) => {
        const tokens = line.toLowerCase().split(' ');
        let op;
        switch (tokens[0]) {
          case 'add.d':
          case 'add.s':
          case 'dadd':
          case 'add':
            op = ADD;
            break;
          case 'addi':
          case 'daddi':
            op = ADDI;
            break;
          case 'sub.s':
          case 'sub.d':
          case 'dsub':
          case 'sub':
            op = SUB;
            break;
          case 'mul.s':
          case 'mul.d':
          case 'dmul':
          case 'mul':
            op = MULT;
            break;
          case 'div.s':
          case 'div.d':
          case 'ddiv':
          case 'div':
            op = DIV;
            break;
          case 'l.d':
          case 'ld':
            op = LOAD;
            break;
          case 's.d':
          case 'sw':
          case 'sd':
            op = STORE;
            break;
          default:
            throw new Error(`Unkowen Instruction ${line} ${tokens}`);
        }
        // handle R4,R2
        const regs = tokens[1].split(',');
        // handle #23
        if (op === ADDI && line.includes('#'))
          return new Instruction(op, regs[0], regs[1], regs[3].substr(1));
        if (op !== LOAD && op !== STORE) return new Instruction(op, ...regs);
        // handle 4(R3)
        if (line.includes('(')) {
          let [offset, baseReg] = regs[1].split('(');
          return new Instruction(
            op,
            regs[0],
            offset,
            baseReg.substr(0, baseReg.length - 1)
          );
        } else {
          // TODO need to handle interpertaion
          return new Instruction(op, ...regs);
        }
      });

    if (this.instructions.length)
      this.queue?.init(this.instructions[this.pc++]);
  }

  update(data) {
    if (!data) {
      if (this.pc === this.instructions.length) return;
      this.queue.add(this.instructions[this.pc++]);
    }
  }
}

export default Parser;
