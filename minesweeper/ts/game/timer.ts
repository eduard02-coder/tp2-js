interface Time {
  min: number;
  sec: number;
  ms: number;
}

class Timer {
  #time = {
    min: 0,
    sec: 0,
  };
  #count!: number;
  #element;
  #isRunning = false;

  constructor(element: HTMLElement) {
    this.#element = element;

    if (!this.#element.innerText.length) {
      this.#element.innerText = ' ';
    }
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
      const strFormat = (n: number) => {
        return String(n).padStart(2, '0');
      };

      let minStr = strFormat(this.#time.min);
      let secStr = strFormat(this.#time.sec);

      // --- initial value on DOM
      (this.#element as HTMLElement).innerHTML =
        `<span>${minStr}</span><span>${secStr}</span>`;

      this.#count = setInterval(() => {
        if (this.#time.sec == 59) {
          this.#time.sec = 0;
          this.#time.min++;
        } else {
          this.#time.sec++;
        }

        minStr = strFormat(this.#time.min);
        secStr = strFormat(this.#time.sec);

        (this.#element as HTMLElement).innerHTML =
          `<span>${minStr}</span><span>${secStr}</span>`;
      }, 1000);
    }
  }

  stop() {
    if (this.#isRunning) {
      this.#isRunning = false;
      clearInterval(this.#count);
    }
  }
}

export { Timer, type Time };
