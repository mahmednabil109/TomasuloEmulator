import Input from '../utils/Input';
import Logger from '../utils/Logger';
import Observer from '../utils/Observer';
import Result from '../utils/Result';

class RegFile extends Observer {
  constructor() {
    super();
    // map would hold an object {tag, value}
    this.buffered = [];
    this.dataMap = new Map();
    this.input = new Input(this);
    this.clk = new Input(this);

    // we don't need output
    // this.output = new Output();
  }

  update(data) {
    if (data) {
      // buffer the operation until the clk
      Logger.assert(data instanceof Result);
      this.buffered.push(data);
    } else {
      // handle clk
      // perform tasks
      // handle buffered
      this._handleBUffered();
    }
  }

  _handleBUffered() {
    this.buffered.forEach((data) => {
      for (const [key, value] of this.dataMap.entries()) {
        if (value.tag === data.tag)
          this.dataMap[key] = { tag: null, value: data.value };
      }
    });
    // then we clear the buffer;
    this.buffered = [];
  }

  // returns [available, tag | value]
  isAvailable(regName) {
    if (this.dataMap.has(regName)) {
      let { tag, value } = this.dataMap.get(regName);
      return [!!tag, tag ? tag : value];
    } else {
      // default value of any regiseter is zero
      return [true, 0];
    }
  }

  tag(regName, tag) {
    this.dataMap.set(regName, { tag, value: 0 });
  }

  setRegto(regName, value) {
    this.dataMap.set(regName, { tag: null, value });
  }
}

export default RegFile;
