import Input from '../utils/Input';
import Observer from '../utils/Observer';
import Output from '../utils/Ouptut';

class Register extends Observer {
  constructor(data) {
    super();
    this.data = data || 0;
    this.input = new Input(this);
    this.clk = new Input(this);
    this.output = new Output();
  }

  update(data) {
    // on the clk signal
    if (!data) {
      this.data = this.input.data;
      this.output.load(this.data);
    }
  }
}

export default Register;
