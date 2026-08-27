class MineSweeper {
  // --- set con constructor
  #prestartCont: HTMLElement;
  #gameCont: HTMLElement;

  // --- set later on
  #boardSize!: {
    rows: number;
    cols: number;
  };
  #board!: HTMLElement;

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

  #getBoardSize(size: string) {
    this.#boardSize = {
      rows: Number(size.split('x')[0]),
      cols: Number(size.split('x')[1]),
    };
  }

  // #selectOptions(lis: HTMLLIElement[]) {
  //   // --- other consts and vars
  //   const firstElementStyle = this.#getSomeStylesFrom(lis[0]);
  //   const secondElementStyle = this.#getSomeStylesFrom(lis[1]);
  //   const length = lis.length;
  //   this.#getBoardSize(lis[0].innerText);

  //   const liEventhandler = async (event: Event) => {
  //     // --- unselected
  //     for (let i = 0; i < length; i++) {
  //       lis[i].style.backgroundColor = secondElementStyle.backgroundColor;
  //       lis[i].style.color = secondElementStyle.color;
  //     }

  //     // --- selected
  //     (event.target as HTMLLIElement).style.backgroundColor =
  //       firstElementStyle.backgroundColor;
  //     (event.target as HTMLLIElement).style.color = firstElementStyle.color;

  //     this.#getBoardSize((event.target as HTMLLIElement).innerText);
  //   };

  //   // --- event adding
  //   for (let i = 0; i < length; i++) {
  //     lis[i].addEventListener('click', liEventhandler);
  //   }
  // }

  async #prestart() {
    // --- DOM Elements
    const prestartContainer = this.#prestartCont;
    const gameContainer = this.#gameCont;
    const elemTamanios = [
      ...prestartContainer.querySelectorAll(' ul.board-sizes > li'),
    ] as HTMLLIElement[];
    const startBt = prestartContainer.querySelector(
      'button',
    ) as HTMLButtonElement;

    // --- other consts and vars
    const firstElementStyle = this.#getSomeStylesFrom(elemTamanios[0]);
    const secondElementStyle = this.#getSomeStylesFrom(elemTamanios[1]);
    const length = elemTamanios.length;
    this.#getBoardSize(elemTamanios[0].innerText);

    const liEventhandler = async (event: Event) => {
      // --- unselected
      for (let i = 0; i < length; i++) {
        elemTamanios[i].style.backgroundColor =
          secondElementStyle.backgroundColor;
        elemTamanios[i].style.color = secondElementStyle.color;
      }

      // --- selected
      (event.target as HTMLLIElement).style.backgroundColor =
        firstElementStyle.backgroundColor;
      (event.target as HTMLLIElement).style.color = firstElementStyle.color;

      this.#getBoardSize((event.target as HTMLLIElement).innerText);
    };

    // --- event adding
    for (let i = 0; i < length; i++) {
      elemTamanios[i].addEventListener('click', liEventhandler);
    }

    return new Promise((resolve) => {
      // --- start button
      const startBtHandler = () => {
        gameContainer.style.display = 'block';
        prestartContainer.style.display = 'none';
        resolve('Board size selected');
      };

      startBt.addEventListener('click', startBtHandler);
    });
  }

  #populateBoard() {
    const cols = this.#boardSize.cols;
    const rows = this.#boardSize.rows;
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
    await this.#prestart();

    this.#gameCont.innerHTML = '';
    this.#populateBoard();
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
