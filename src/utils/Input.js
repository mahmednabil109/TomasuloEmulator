import Observer from './Observer';
class Input extends Observer {
  constructor(context) {
    super();
    this.context = context;
    this.data = 0;
  }

  tick() {
    this.context?.update();
  }

  update(data) {
    this.data = data;
    this.context?.update(data);
  }
}

export default Input;
