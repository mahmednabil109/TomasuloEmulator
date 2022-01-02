import { LOAD, STORE } from '../constants/Operations';
import Input from '../utils/Input';
import Logger from '../utils/Logger';
import Observer from '../utils/Observer';
import Operation from '../utils/Operation';
import Output from '../utils/Ouptut';
import Result from '../utils/Result';

class Memory extends Observer {
  constructor(latency) {
    super();
    this.latency = latency;
    this.dataMap = new Map();
    this.opertations = [];

    this.input = new Input(this);
    this.clk = new Input(this);
    this.output = new Output();
  }

  update(data) {
    if (data) {
      Logger.assert(data instanceof Operation, 'data must be an operation');
      if (data.operation !== LOAD && data.operation !== STORE) return;
      this.operation.push({ data, count: -1 });
    } else {
      this.opertations = this.opertations.map(({ data, count }) => ({
        data,
        count: count + 1,
      }));
      this.opertations = this.opertations.filter(({ data, count }) => {
        if (count === this.latency) {
          let addresse = Number(data.operand1) + Number(data.operand2);

          switch (data.tag) {
            case STORE:
              this.dataMap.set(addresse, this.dst);
              break;
            case LOAD:
              if (!this.dataMap.has(addresse)) this.dataMap.set(addresse, 0);
              this.output.load(
                new Result(data.tag, this.dataMap.get(addresse))
              );
              break;
            default:
              break;
          }
          return false;
        }
        return true;
      });
    }
  }
}

export default Memory;
