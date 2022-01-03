import Input from '../utils/Input';
import Operation from '../utils/Operation';
import Logger from '../utils/Logger';
import Observer from '../utils/Observer';
import Output from '../utils/Ouptut';
import Result from '../utils/Result';
import { STORE } from '../constants/Operations';

class ReserveStations extends Observer {
  // takes an array types of the valid oprations
  // takes a object that maps operation to delay
  constructor(size, types, exec, el) {
    super();
    this.el = el;
    this.size = size;
    this.exec = exec;
    this.counter = 0;
    this.tagPrefix = types[0];
    this.types = new Set(types);
    this.operations = [];
    this.buffered = [];

    this.input = new Input(this);
    this.clk = new Input(this);
    this.output = new Output();
  }

  update(data) {
    if (data) {
      // Input Change
      if (data instanceof Operation) {
        // check that there is a space
        Logger.assert(
          this.operations.length < this.size,
          'reservation station dose not have enough space'
        );
        // if it matches the resercation station then add it
        if (this.types.has(data.operation)) this.operations.push(data);
      }

      if (data instanceof Result) {
        this.buffered.push(data);
      }
    } else {
      // clk tick
      this.operations = this.operations.filter((op) => {
        if (op.isReady()) this.output.load(op);
        return !op.isReady();
      });

      // handleBuffered
      this._handleBuffered();
    }
    this.render();
  }

  render() {
    this.el.innerHTML = '';
    this.operations.forEach((op) => {
      const div = document.createElement('div');
      div.setAttribute('class', 'operation');
      if (op.operation === STORE) {
        div.innerHTML = `
        <p class="otag"> [${op.tag}]</p>
        <p class="op">${op.operation}</p>
        <p class="${op.opTag ? 'tag' : ''}">${op.dst}</p>
        <p>${op.operand1}</p>
        <p class="${op.tag2 ? 'tag' : ''}">${op.operand2}</p>
      `;
      } else {
        div.innerHTML = `
        <p class="otag"> [${op.tag}]</p>
        <p class="op">${op.operation}</p>
        <p class="${op.tag1 ? 'tag' : ''}">${op.operand1}</p>
        <p class="${op.tag2 ? 'tag' : ''}">${op.operand2}</p>
      `;
      }
      this.el.appendChild(div);
    });
    this.exec.operations.forEach(({ data }) => {
      if (!this.types.has(data.operation)) return;
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

  _handleBuffered() {
    this.buffered.forEach((data) => {
      for (let i = 0; i < this.operations.length; i++) {
        if (!this.operations[i].needs(data.tag)) continue;
        // if the tag matches then substitute it
        this.operations[i].substitute(data);
      }
    });
    // clear the buffer
    this.buffered = [];
  }

  hasSpace(OP) {
    if (OP) {
      return (
        this.operations.length +
          this.exec.operations.filter(({ data }) => OP === data.operation)
            .length !==
        this.size
      );
    }
    return this.operations.length + this.exec.operations.length !== this.size;
  }

  nextTag() {
    return `${this.tagPrefix}${this.counter++}`;
  }
}
export default ReserveStations;
