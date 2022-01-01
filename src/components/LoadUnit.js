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
      if (data)
        this.dataMap.set(data, {
          latency: this.latency,
          destination: destination,
        });
    }
    console.log(this.dataMap, 'DATAMAP');
    var write = false;
    for (var [key, { latency, destination }] of this.dataMap) {
      let l = latency - 1;
      this.dataMap.set(key, { l, destination });
      if (l <= 0 && !write) {
        this.output.load({ key, destination });
        write = true;
        this.dataMap.delete(key);
      }
    }
  }
}
export default LoadUnit;
