import { ADD, ADDI, SUB } from '../constants/Operations';
import Input from '../utils/Input';
import Logger from '../utils/Logger';
import Observer from '../utils/Observer';
import Operation from '../utils/Operation';
import Output from '../utils/Ouptut';
import Result from '../utils/Result';

class Adder extends Observer {
  constructor(latency, el) {
    super();
    this.el = el;
    this.latency = latency;
    this.operations = [];

    this.input = new Input(this);
    this.clk = new Input(this);
    this.output = new Output();
  }

  update(data) {
    if (data) {
      Logger.assert(data instanceof Operation, 'data must be an operation');
      // TODO handle ADDI
      if (
        data.operation !== ADD &&
        data.operation !== SUB &&
        data.operation !== ADDI
      )
        return;
      this.operations.push({ data, count: 0 });
    } else {
      this.operations = this.operations.map(({ data, count }) => ({
        data,
        count: count + 1,
      }));
      this.operations = this.operations.filter(({ data, count }) => {
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

export default Adder;
