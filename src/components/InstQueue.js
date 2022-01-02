import Input from '../utils/Input';
import Output from '../utils/Ouptut';
import {
  ADD,
  ADDI,
  SUB,
  MULT,
  DIV,
  STORE,
  LOAD,
} from '../constants/Operations';
import Observer from '../utils/Observer';
import Operation from '../utils/Operation';

class InstQueue extends Observer {
  constructor(addRS, multRS, loadRS, storeRS, regFile, el) {
    super();
    this.el = el;
    this.instructions = [];
    this.regFile = regFile;
    this.RSs = {
      [ADD]: addRS,
      [ADDI]: addRS,
      [SUB]: addRS,
      [MULT]: multRS,
      [DIV]: multRS,
      [LOAD]: loadRS,
      [STORE]: storeRS,
    };

    // it dose not need an input

    this.clk = new Input(this);
    // outputs to the alu and the load and the store RS
    this.output = new Output();
  }

  update(data) {
    if (!data) {
      this.instructions = this.instructions.filter((inst) => {
        // issue it if the reservation station has space
        // we return true if there is not space to not filter it
        if (!this.RSs[inst.operation]?.hasSpace()) return true;
        let operation;
        let availableTag = this.RSs[inst.operation].nextTag();
        if (inst.operation === STORE) {
          const [dstAvail, dstData] = this.regFile.isAvailable(inst.dst);
          const [reg2Avail, reg2Data] = this.regFile.isAvailable(inst.reg2);
          operation = new Operation(
            availableTag,
            inst.operation,
            inst.reg1,
            reg2Data,
            null,
            reg2Avail ? null : reg2Data,
            dstData,
            dstAvail ? null : dstData
          );
        } else if (inst.operation === LOAD) {
          let [reg2Avail, reg2Data] = this.regFile.isAvailable(inst.reg2);
          operation = new Operation(
            availableTag,
            inst.operation,
            inst.reg1,
            reg2Data,
            null,
            reg2Avail ? null : reg2Data
          );
          this.regFile.tag(inst.dst, availableTag);
        } else {
          const [reg1Avail, reg1Data] = this.regFile.isAvailable(inst.reg1);
          const [reg2Avail, reg2Data] = this.regFile.isAvailable(inst.reg2);
          operation = new Operation(
            availableTag,
            inst.operation,
            reg1Data,
            reg2Data,
            reg1Avail ? null : reg1Data,
            reg2Avail ? null : reg2Data
          );
          this.regFile.tag(inst.dst, availableTag);
        }
        this.output.load(operation);
        // return false to filter this instruction
        return false;
      });
      this.render();
    }
  }

  render() {
    this.el.innerHTML = '';
    this.instructions.forEach((inst) => {
      const div = document.createElement('div');
      div.innerText = JSON.stringify(inst);
      this.el.appendChild(div);
    });
  }

  // inialize the queue
  init(inst) {
    this.instructions = [inst];
    this.render();
  }
  // add instruction to the queue
  add(inst) {
    this.instructions.push(inst);
    this.render();
  }
}

export default InstQueue;
