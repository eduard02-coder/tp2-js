import { SettingsWindow, type settingsType } from './setting-window.ts';

interface tileType {
  dom: HTMLElement;
  mined: boolean;
  open: boolean;
}

class MineSweeper {
  // --- set con constructor
  #gameCont: HTMLElement;
  #settingsObj: SettingsWindow;

  // --- set later on
  #board!: HTMLElement;
  #tileArray: tileType[] = [];

  constructor(MineSweeperContainer: HTMLElement) {
    this.#gameCont = MineSweeperContainer.getElementsByClassName(
      'game',
    )[0] as HTMLElement;

    this.#settingsObj = new SettingsWindow(MineSweeperContainer);
  }

  #populateBoard(settings: settingsType) {
    const cols = settings.cols;
    const rows = settings.rows;
    const totalTiles = cols * rows;

    this.#board = document.createElement('div');
    this.#gameCont.append(this.#board);
    this.#board.className = 'board';

    for (let i = 0; i < totalTiles; i++) {
      const newDiv = document.createElement('div');
      this.#board.append(newDiv);

      const tile = {
        dom: newDiv,
        open: false,
        mined: false,
      };

      this.#tileArray.push(tile);
    }

    this.#board.style.display = 'grid';
    this.#board.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    this.#board.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    this.#board.style.gap = '2px';
  }

  #speadMines(mines: number) {}

  async start() {
    let settings = (await this.#settingsObj.run()) as settingsType;
    console.log(settings);

    this.#populateBoard(settings);

    console.log(this.#tileArray);
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
