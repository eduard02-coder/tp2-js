import { SettingsWindow, type settingsType } from './setting-window.ts';

interface tileType {
  dom: HTMLElement;
  mined: boolean;
  open: boolean;
  surrMines: number;
}

interface tileSurroundingType {
  up: null | tileType;
  upRight: null | tileType;
  right: null | tileType;
  downRight: null | tileType;
  down: null | tileType;
  downLeft: null | tileType;
  left: null | tileType;
  upLeft: null | tileType;
}

class MineSweeper {
  // --- set con constructor
  #gameCont: HTMLElement;
  #settingsObj: SettingsWindow;

  // --- set later on
  #board!: HTMLElement;
  #tileArray: tileType[] = [];
  #settings!: settingsType;
  #mineTiles!: tileType[];

  constructor(MineSweeperContainer: HTMLElement) {
    this.#gameCont = MineSweeperContainer.getElementsByClassName(
      'game',
    )[0] as HTMLElement;

    this.#settingsObj = new SettingsWindow(MineSweeperContainer);
  }

  #tileSurrounding(tile: tileType) {
    const length = this.#tileArray.length;
    const positionOfTile = this.#tileArray.indexOf(tile);
    const returnVal: tileSurroundingType = {
      up: null,
      upRight: null,
      right: null,
      downRight: null,
      down: null,
      downLeft: null,
      left: null,
      upLeft: null,
    };

    // const nCol

    // --- left, right, up, down
    if (!(positionOfTile % this.#settings.cols === 0)) {
      returnVal.left = this.#tileArray[positionOfTile - 1];
    }

    if (!((positionOfTile + 1) % this.#settings.cols === 0)) {
      returnVal.right = this.#tileArray[positionOfTile + 1];
    }

    if (!(positionOfTile - this.#settings.cols < 0)) {
      returnVal.up = this.#tileArray[positionOfTile - this.#settings.cols];
    }

    if (!(positionOfTile + this.#settings.cols > length)) {
      returnVal.down = this.#tileArray[positionOfTile + this.#settings.cols];
    }

    // --- diagonals
    if (returnVal.up !== null) {
      if (returnVal.left !== null) {
        returnVal.upLeft =
          this.#tileArray[positionOfTile - this.#settings.cols - 1];
      }

      if (returnVal.right !== null) {
        returnVal.upRight =
          this.#tileArray[positionOfTile - this.#settings.cols + 1];
      }
    }

    if (returnVal.down !== null) {
      if (returnVal.left !== null) {
        returnVal.downLeft =
          this.#tileArray[positionOfTile + this.#settings.cols - 1];
      }

      if (returnVal.right !== null) {
        returnVal.downRight =
          this.#tileArray[positionOfTile + this.#settings.cols + 1];
      }
    }

    return returnVal;
  }

  #markAroundMines() {
    for (let tile of this.#mineTiles) {
      const surrounding = this.#tileSurrounding(tile);
      const keys = Object.keys(surrounding) as (keyof typeof surrounding)[];

      for (let k of keys) {
        if (surrounding[k] !== null) {
          if (!(surrounding[k] as tileType).mined) {
            (surrounding[k] as tileType).dom.style.border = '2px solid black';
          }
        }
      }
    }
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
        surrMines: 0,
      };
      this.#tileArray.push(tile);

      newDiv.className = 'closed';
      const p = document.createElement('p');
      newDiv.append(p);
    }

    this.#board.style.display = 'grid';
    this.#board.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    this.#board.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    this.#board.style.gap = '2px';
  }

  #speadMines(mines: number) {
    const shuffled = [...this.#tileArray];

    for (let i = shuffled.length - 1; i > shuffled.length - 1 - mines; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    this.#mineTiles = shuffled.slice(shuffled.length - mines);

    for (let tile of this.#mineTiles) {
      tile.mined = true;

      // --- borrar al terminar el desarrollo
      tile.dom.style.backgroundColor = 'red';
    }
  }

  #eventsOnLoosing() {
    const container = this.#board;
    const newContainer = container.cloneNode(true);
    (container.parentNode as HTMLElement).replaceChild(newContainer, container);
  }

  #setClickEvents() {
    for (let tile of this.#tileArray) {
      tile.dom.addEventListener('click', () => {
        tile.open = true;

        // --- if you hit a mine, ...
        if (tile.mined) {
          this.#eventsOnLoosing();
        } else {
          // --- set tile open
          tile.dom.className = 'open';
        }
      });
    }
  }

  async start() {
    this.#settings = (await this.#settingsObj.run()) as settingsType;
    console.log(this.#settings);

    this.#populateBoard(this.#settings);
    this.#speadMines(this.#settings.mines);
    this.#markAroundMines();
    this.#setClickEvents();
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
