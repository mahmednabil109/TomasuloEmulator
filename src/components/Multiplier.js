import { DIV, MULT } from '../constants/Operations';
import Input from '../utils/Input';
import Logger from '../utils/Logger';
import Observer from '../utils/Observer';
import Operation from '../utils/Operation';
import Output from '../utils/Ouptut';
import Result from '../utils/Result';

class Multiplier extends Observer {
  constructor(latency) {
    super();
    this.latency = latency;
    this.operations = [];

    this.input = new Input(this);
    this.clk = new Input(this);
    this.output = new Output();
  }

  update(data) {
    if (data) {
      Logger.assert(data instanceof Operation, 'data must be an operation');
      if (data.operation !== MULT && data.operation !== DIV) return;
      this.operations.push({ data, count: -1 });
    } else {
      // add one to the count
      this.operations = this.operations.map(({ data, count }) => ({
        data,
        count: count + 1,
      }));
      // filter finished operations
      this.operations = this.operations.filter(({ data, count }) => {
        if (count === this.latency) {
          this.output.load(
            new Result(
              data.tag,
              data.operation === MULT
                ? Number(data.operand1) * Number(data.operand2)
                : Number(data.operand1) / Number(data.operand2)
            )
          );
          // return false to remove it from the list
          return false;
        }
        return true;
      });
    }
  }
}

export default Multiplier;
