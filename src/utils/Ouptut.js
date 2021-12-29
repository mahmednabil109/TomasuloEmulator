import Observable from './Observable';
class Output extends Observable {
  constructor() {
    super();
  }

  load(data) {
    this.data = data;
    this.update();
  }
}

export default Output;
