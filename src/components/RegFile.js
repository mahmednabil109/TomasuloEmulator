import Input from '../utils/Input';
import Logger from '../utils/Logger';
import Observer from '../utils/Observer';
import Result from '../utils/Result';

class RegFile extends Observer {
  constructor(el) {
    super();
    // map would hold an object {tag, value}
    this.el = el;
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
      Logger.assert(data instanceof Result, 'data must be a result');

      this.buffered.push(data);
    } else {
      // handle clk
      // perform tasks
      // handle buffered
      this._handleBUffered();
      this.render();
    }
  }

  render() {
    this.el.innerHTML = '';
    for (const [key, value] of this.dataMap) {
      const div = document.createElement('div');
      div.setAttribute('class', 'register');
      div.innerHTML = `
        <p style="flex-align:flex-start;">${key}</p>
        <p>-></p>
        <p class="tag">[${value.tag || '-'}]</p>
        <p>${value.value}</p>
      `;
      this.el.append(div);
    }
  }

  _handleBUffered() {
    this.buffered.forEach((data) => {
      for (const [key, value] of this.dataMap.entries()) {
        if (value.tag === data.tag) {
          this.dataMap.set(key, { tag: null, value: data.value });
        }
      }
    });
    // then we clear the buffer;
    this.buffered = [];
  }

  // returns [available, tag | value]
  isAvailable(regName) {
    if (this.dataMap.has(regName)) {
      let { tag, value } = this.dataMap.get(regName);
      return [!tag, tag ? tag : value];
    } else {
      // default value of any regiseter is zero
      return [true, 0];
    }
  }

  tag(regName, tag) {
    this.dataMap.set(regName.toLowerCase(), { tag, value: 0 });
    this.render();
  }

  setRegto(regName, value) {
    this.dataMap.set(regName, { tag: null, value });
    this.render();
  }
}

export default RegFile;
