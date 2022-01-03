import { DIV, MULT } from '../constants/Operations';
import Input from '../utils/Input';
import Logger from '../utils/Logger';
import Observer from '../utils/Observer';
import Operation from '../utils/Operation';
import Output from '../utils/Ouptut';
import Result from '../utils/Result';

class Multiplier extends Observer {
  constructor(mLatency, dLatency, el) {
    super();
    this.el = el;
    this.mLatency = mLatency;
    this.dLatency = dLatency;
    this.operations = [];

    this.input = new Input(this);
    this.clk = new Input(this);
    this.output = new Output();
  }

  update(data) {
    if (data) {
      Logger.assert(data instanceof Operation, 'data must be an operation');
      if (data.operation !== MULT && data.operation !== DIV) return;
      this.operations.push({ data, count: 0 });
    } else {
      // add one to the count
      this.operations = this.operations.map(({ data, count }) => ({
        data,
        count: count + 1,
      }));
      // filter finished operations
      this.operations = this.operations.filter(({ data, count }) => {
        if (
          (data.operation === DIV && count === this.dLatency) ||
          (data.operation === MULT && count === this.mLatency)
        ) {
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
    this.render();
  }

  render() {
    this.el.innerHTML = '';
    this.operations.forEach(({ data }) => {
      const div = document.createElement('div');
      div.setAttribute('class', 'operation executing');
      div.innerHTML = `
        <p class="otag">[${data.tag}]</p>
        <p class="op">${data.operation}</p>
        <p>${data.operand1}</p>
        <p>${data.operand2}</p>
      `;
      this.el.appendChild(div);
    });
  }
}

export default Multiplier;
