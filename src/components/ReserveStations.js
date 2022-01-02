import Input from '../utils/Input';
import Operation from '../utils/Operation';
import Logger from '../utils/Logger';
import Observer from '../utils/Observer';
import Output from '../utils/Ouptut';
import Result from '../utils/Result';

class ReserveStations extends Observer {
  // takes an array types of the valid oprations
  // takes a object that maps operation to delay
  constructor(size, types) {
    super();
    this.size = size;
    this.counter = 0;
    this.types = new Set(types);
    this.operations = [];
    this.buffered = [];
    this.input = new Input(this);
    this.output = new Output();
  }

  update(data) {
    if (data) {
      // Input Change
      if (data instanceof Operation) {
        // check that there is a space
        Logger.assert(this.operations.length < this.size);
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
  }

  _handleBuffered() {
    this.buffered.forEach((data) => {
      for (let i = 0; i < this.operations.length; i++) {
        if (!this.operations.needs(data.tag)) continue;
        // if the tag matches then substitute it
        this.operations.substitute(data);
      }
    });
    // clear the buffer
    this.buffered = [];
  }

  hasSpace() {
    this.operations.length !== this.size;
  }

  nextTag() {
    return `${this.types[0]}${this.counter++}`;
  }
}
export default ReserveStations;
