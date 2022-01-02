import { ADD, ADDI, SUB } from '../constants/Operations';
import Input from '../utils/Input';
import Logger from '../utils/Logger';
import Observer from '../utils/Observer';
import Operation from '../utils/Operation';
import Output from '../utils/Ouptut';
import Result from '../utils/Result';

class Adder extends Observer {
  constructor(latency) {
    super();
    this.latency = latency;
    this.operation = [];

    this.input = new Input(this);
    this.clk = new Input(this);
    this.output = new Output();
  }

  update(data) {
    if (data) {
      Logger.assert(data instanceof Operation);
      // TODO handle ADDI
      if (
        data.operation !== ADD &&
        data.operation !== SUB &&
        data.operation !== ADDI
      )
        return;
      this.operations.push({ data, count: 0 });
    } else {
      this.operation = this.operation.map(({ data, count }) => ({
        data,
        count: count + 1,
      }));
      this.operation = this.operation.filter(({ data, count }) => {
        if (count === this.latency) {
          this.output.load(
            new Result(
              data.tag,
              data.operation === ADD
                ? Number(data.operand1 + data.operand2)
                : Number(data.operand1 - data.operand2)
            )
          );
          return false;
        }
        return true;
      });
    }
  }
}

export default Adder;
