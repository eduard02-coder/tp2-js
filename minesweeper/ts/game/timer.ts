interface Time {
  min: number;
  sec: number;
  ms: number;
}

class Timer {
  #time = {
    min: 0,
    sec: 0,
    ms: 0,
  };
  #count!: number;
  #element;
  #isRunning = false;
  #format: string;
  #counter = () => {
    if (this.#time.sec == 59) {
      this.#time.sec = 0;
      this.#time.min++;
    } else {
      this.#time.sec++;
    }
  };

  constructor(element: HTMLElement, format: string = 'min:sec:ms') {
    this.#element = element;
    this.#element.innerText = ' ';
    this.#format = format;
  }

  get time() {
    if (this.#isRunning) {
      return this.#time;
    } else {
      return null;
    }
  }

  start(startingTime: Time | null = null) {
    if (!this.#isRunning) {
      this.#isRunning = true;

      if (startingTime) {
        this.#time = startingTime;
      }

      if (this.#format === 'min:sec:ms') {
        this.#count = setInterval(() => {
          if (this.#time.ms == 99) {
            this.#counter();
          } else {
            this.#time.ms++;
          }

          this.#update();
        }, 10);
      }

      if (this.#format === 'min:sec') {
        this.#count = setInterval(() => {
          this.#counter();

          this.#update();
        }, 1000);
      }
    }
  }

  stop() {
    if (this.#isRunning) {
      this.#isRunning = false;
      clearInterval(this.#count);
    }
  }

  #update() {
    const mAlt = String(this.#time.min).padStart(2, '0');
    const sAlt = String(this.#time.sec).padStart(2, '0');
    const msAlt = String(this.#time.ms).padStart(2, '0');

    (this.#element.firstChild as HTMLElement).nodeValue =
      `${mAlt}:${sAlt}:${msAlt}`;
  }
}

export { Timer, type Time };
