import { LOAD, STORE } from '../constants/Operations';
import Input from '../utils/Input';
import Logger from '../utils/Logger';
import Observer from '../utils/Observer';
import Operation from '../utils/Operation';
import Output from '../utils/Ouptut';
import Result from '../utils/Result';

class Memory extends Observer {
  constructor(latency, el) {
    super();
    this.el = el;
    this.latency = latency;
    this.dataMap = new Map();
    this.operations = [];

    this.input = new Input(this);
    this.clk = new Input(this);
    this.output = new Output();
  }

  update(data) {
    if (data) {
      Logger.assert(data instanceof Operation, 'data must be an operation');
      if (data.operation !== LOAD && data.operation !== STORE) return;
      this.operations.push({ data, count: 0 });
    } else {
      this.operations = this.operations.map(({ data, count }) => ({
        data,
        count: count + 1,
      }));
      this.operations = this.operations.filter(({ data, count }) => {
        if (count === this.latency) {
          let addresse = Number(data.operand1) + Number(data.operand2);

          switch (data.operation) {
            case STORE:
              this.dataMap.set(addresse, data.dst);
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
    this.render();
  }

  render() {
    this.el.innerHTML = '';
    for (const [key, value] of this.dataMap) {
      const div = document.createElement('div');
      div.setAttribute('class', 'mem-record');
      div.innerHTML = `
        <p class="address">@${key}</p>
        <p>${value}</p>
      `;
      this.el.appendChild(div);
    }
  }
}

export default Memory;
