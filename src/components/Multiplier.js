import Input from '../utils/Input';
import Observer from '../utils/Observer';
import Output from '../utils/Ouptut';

class Multiplier extends Observer {
  constructor() {
    super();
    this.input = new Input(this);
    this.dataMap = new Map();
    this.clk = new Input(this);
    this.output = new Output();
    this.load = false;
  }

  update(data) {
    if (!data) {
      if (this.input.data.length != 0) {
        for (const oper of this.input.data) {
          const { operation, firstReg, secondReg, tag } = oper;
          let result = firstReg;
          const counter = 0;
          if (operation == 'mult') {
            result *= secondReg;
          } else {
            result /= secondReg;
          }
          this.dataMap.set(tag, {
            result,
            counter,
          });
        }
      }
      this.dataMap.forEach((value, key) => {
        if (value.counter < 2) {
          value.counter += 1;
        } else {
          if (!this.load) {
            this.output.load({ result: value.result, tag: key });
            this.load = true;
          }
        }
      });
      if (this.load) {
        this.load = false;
        this.dataMap.delete(this.output.data.tag);
      }
    }
  }
}

export default Multiplier;
