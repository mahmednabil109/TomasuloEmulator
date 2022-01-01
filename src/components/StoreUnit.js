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
    if (input)
      this.dataMap.set(input['address'], {
        latency: input['latency'],
        value: input['value'],
      });
    var write = false;
    for (var [address, { latency, value }] of this.dataMap) {
      let l = latency - 1;
      if (l <= 0 && !write) {
        this.output.load(this.memoryUnit.map.set(address, value));
      }
    }
  }
}
export default StoreUnit;
