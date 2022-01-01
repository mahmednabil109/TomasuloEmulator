import Input from '../utils/Input';
import Observer from '../utils/Observer';
import Output from '../utils/Ouptut';

class MemoryUnit {
  constructor() {
    this.map = new Map();
    this.map.set(1, 10);
    this.map.set(2, 15);
  }
  get(address) {
    return this.map.get(address);
  }
}

export default MemoryUnit;
