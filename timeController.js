export class TimeController extends EventTarget {
  constructor() {
    super();
    this.ingameDate = new Date('2400-01-01T00:00:00');
    this.speed = 0;
    this.timer = null;
  }

  _tick() {
    this.ingameDate.setHours(this.ingameDate.getHours() + 1);
    this.dispatchEvent(new CustomEvent('time_tick', { detail: new Date(this.ingameDate) }));
  }

  _setSpeed(speed) {
    this.speed = speed;
    if (this.timer) clearInterval(this.timer);
    if (speed === 0) return;
    const interval = speed === 1 ? 2500 : 1000;
    this.timer = setInterval(() => this._tick(), interval);
  }

  pause() { this._setSpeed(0); }
  playNormal() { this._setSpeed(1); }
  playFast() { this._setSpeed(4); }
  skipTo(datetime) {
    this.ingameDate = new Date(datetime);
    this._tick();
  }
}
