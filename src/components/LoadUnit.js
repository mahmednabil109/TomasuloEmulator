import Input from '../utils/Input';
import Observer from '../utils/Observer';
import Output from '../utils/Ouptut';
import MemoryUnit from './MemoryUnit';

class LoadUnit extends Observer {
  constructor(latency) {
    super();

    //Map holding outputs and latency
    this.dataMap = new Map();

    //latency of the unit described by user
    this.latency = latency;

    //object having base , offset , register to load into
    this.input = new Input(this);

    //object having the value of the target address
    this.output = new Output(this);

    //this is an issue i'll work to solve it but i made it only for testing
    this.memoryUnit = new MemoryUnit();
  }

  update(input) {
    if (input) {
      let { base, offset, destination } = input;
      let data = this.memoryUnit.get(base + offset);
      if (data) {
        let vals = this.dataMap.get(destination);
        console.log('VALS', typeof vals);
        if (vals) {
          vals.push({ latency: this.latency, data });
          this.dataMap.set(destination, vals);
        } else {
          this.dataMap.set(destination, [{ latency: this.latency, data }]);
        }
      }
    }

    var write = false;
    for (var [key, values] of this.dataMap) {
      let index = 0;
      console.log(key, values, 'KV');
      for (var { latency, data } of values) {
        console.log(latency, data, 'LD');
        latency--;
        // this.dataMap.set(key, { latency, data });
        if (latency <= 0 && !write) {
          this.output.load({ key, data });
          write = true;
          values.pop(index);
        }
        index++;
      }
    }
  }
}
export default LoadUnit;
