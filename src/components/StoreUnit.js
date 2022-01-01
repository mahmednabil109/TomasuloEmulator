import Input from '../utils/Input';
import Observer from '../utils/Observer';
import Output from '../utils/Ouptut';
import MemoryUnit from './MemoryUnit';

class StoreUnit extends Observer {
  constructor(latency) {
    super();

    this.dataMap = new Map();

    this.latency = latency;

    //value and destination
    this.input = new Input(this);

    this.output = new Output(this);

    this.memoryUnit = new MemoryUnit();
  }

  update(input) {
    if (input) {
      var { addr, val } = input;
      var data = this.dataMap.get(addr);
      if (data) {
        data.push({
          latency: this.latency,
          value: val,
        });
        this.dataMap.set(addr, data);
      } else {
        this.dataMap.set(addr, [
          {
            latency: this.latency,
            value: val,
          },
        ]);
      }
    }
    var write = false;
    for (var [address, values] of this.dataMap) {
      let index = 0;
      for (var [latency, value] of values) {
        latency--;
        if (l <= 0 && !write) {
          this.output.load(this.memoryUnit.map.set(address, value));
          values.pop(index);
        }
        index++;
      }
    }
  }
}
export default StoreUnit;
