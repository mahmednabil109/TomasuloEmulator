class Observable {
  constructor() {
    this.data = 0;
    this.observers = [];
  }

  connect(observer) {
    if (observer) this.observers.push(observer);
    observer.update(this.data);
  }

  update() {
    this.observers.forEach((obs) => obs?.update(this.data));
  }
}

export default Observable;
