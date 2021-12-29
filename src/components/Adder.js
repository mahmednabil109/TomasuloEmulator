import Input from '../utils/Input';
import Observer from '../utils/Observer';
import Output from '../utils/Ouptut';

class Adder extends Observer {
  constructor() {
    super();
    this.input1 = new Input(this);
    this.input2 = new Input(this);
    this.output = new Output();
  }

  update(data) {
    if (data) {
      this.output.load(this.input1.data + this.input2.data);
    }
  }
}

export default Adder;
