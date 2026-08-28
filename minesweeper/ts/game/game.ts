interface mutableData {
  value: string;
}

interface settingsType {
  rows: number;
  cols: number;
  mines: number;
}

interface someStylesType {
  color: string;
  backgroundColor: string;
}

interface selectorStyleType {
  selected: someStylesType;
  unselected: someStylesType;
}

class MineSweeper {
  // --- set con constructor
  #prestartCont: HTMLElement;
  #gameCont: HTMLElement;

  // --- set later on
  #board!: HTMLElement;

  #selectorStyle: selectorStyleType = {
    selected: {
      color: '',
      backgroundColor: '',
    },

    unselected: {
      color: '',
      backgroundColor: '',
    },
  };

  constructor(MineSweeperContainer: HTMLElement) {
    this.#prestartCont = MineSweeperContainer.getElementsByClassName(
      'prestart',
    )[0] as HTMLElement;

    this.#gameCont = MineSweeperContainer.getElementsByClassName(
      'game',
    )[0] as HTMLElement;
  }

  #getSomeStylesFrom(element: HTMLElement) {
    return {
      backgroundColor: window.getComputedStyle(element).backgroundColor,
      color: window.getComputedStyle(element).color,
    };
  }

  #setEventsOnLis(
    lis: NodeListOf<HTMLLIElement>,
    data: mutableData,
    secondaryFunc: null | ((entry: HTMLElement) => void) = null,
  ) {
    if (!this.#selectorStyle.selected.color.length) {
      this.#selectorStyle.selected = this.#getSomeStylesFrom(lis[0]);
    }

    if (!this.#selectorStyle.unselected.color.length) {
      this.#selectorStyle.unselected = this.#getSomeStylesFrom(lis[1]);
    }

    const length = lis.length;

    const liEventHandler = (event: Event) => {
      // --- unselected
      for (let i = 0; i < length; i++) {
        lis[i].style.backgroundColor =
          this.#selectorStyle.unselected.backgroundColor;
        lis[i].style.color = this.#selectorStyle.unselected.color;
      }

      // --- selected
      (event.target as HTMLLIElement).style.backgroundColor =
        this.#selectorStyle.selected.backgroundColor;
      (event.target as HTMLLIElement).style.color =
        this.#selectorStyle.selected.color;

      data.value = (event.target as HTMLLIElement).innerText;

      if (secondaryFunc) {
        secondaryFunc(event.target as HTMLElement);
      }
    };

    // --- event adding
    for (let i = 0; i < length; i++) {
      lis[i].addEventListener('click', liEventHandler);
    }
  }

  async #prestart() {
    // --- DOM Elements
    const prestartContainer = this.#prestartCont;
    const gameContainer = this.#gameCont;
    const elemTamanios = prestartContainer.querySelectorAll(
      ' ul.board-sizes > li',
    ) as NodeListOf<HTMLLIElement>;
    const startBt = prestartContainer.querySelector(
      'button',
    ) as HTMLButtonElement;

    // --- other variables and consts
    const boardSize = {
      value: '',
    };

    const mineNumb = {
      value: '',
    };

    const secondaryHandler = (entrada: HTMLElement) => {
      // ---board size options handling
      const parent = entrada.parentElement as HTMLUListElement;
      const index = Array.prototype.indexOf.call(parent.children, entrada);

      const mineOptionsUls = document.querySelectorAll(
        '#minesweeper > section.prestart > ul.mine-options',
      );

      // --- hide all
      const length = mineOptionsUls.length;
      for (let i = 0; i < length; i++) {
        (mineOptionsUls[i] as HTMLUListElement).style.display = 'none';
      }

      // --- show according selected
      (mineOptionsUls[index] as HTMLUListElement).style.display = 'flex';

      const mineOptionsLis = mineOptionsUls[index]
        .children as unknown as NodeListOf<HTMLLIElement>;
      this.#setEventsOnLis(mineOptionsLis, mineNumb);
      mineOptionsLis[0].click();
    };

    this.#setEventsOnLis(elemTamanios, boardSize, secondaryHandler);
    elemTamanios[0].click();

    return new Promise((resolve) => {
      // --- start button
      const startBtHandler = () => {
        gameContainer.style.display = 'block';
        prestartContainer.style.display = 'none';
        const arr = boardSize.value.split('x');

        resolve({
          rows: Number(arr[0]),
          cols: Number(arr[1]),
          mines: Number(mineNumb.value),
        });
      };

      startBt.addEventListener('click', startBtHandler);
    });
  }

  #populateBoard(settings: settingsType) {
    const cols = settings.cols;
    const rows = settings.rows;
    const totalSquares = cols * rows;

    this.#board = document.createElement('div');
    this.#gameCont.append(this.#board);
    this.#board.className = 'board';

    for (let i = 0; i < totalSquares; i++) {
      const newDiv = document.createElement('div');
      this.#board.append(newDiv);
    }

    this.#board.style.display = 'grid';
    this.#board.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    this.#board.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    this.#board.style.gap = '2px';
  }

  async start() {
    let settings = await this.#prestart();
    console.log(settings);

    this.#gameCont.innerHTML = '';
    // this.#populateBoard(settings);
  }
}

async function main() {
  const MineSweeperContainer = document.getElementById(
    'minesweeper',
  ) as HTMLElement;

  let game = new MineSweeper(MineSweeperContainer);
  game.start();
}

main();

// --------------------------------
