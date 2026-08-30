import { SettingsWindow, type settingsType } from './setting-window.ts';
import { Timer } from './timer.ts';

interface tileType {
  dom: HTMLElement;
  mined: boolean;
  open: boolean;
  flagged: boolean;
  minesAround: number;
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
  #infoBar!: HTMLElement;
  #timer!: any;

  constructor(MineSweeperContainer: HTMLElement) {
    this.#gameCont = MineSweeperContainer.getElementsByClassName(
      'game',
    )[0] as HTMLElement;

    this.#settingsObj = new SettingsWindow(MineSweeperContainer);
  }

  #tileSurrounding(tile: tileType) {
    const length = this.#tileArray.length;
    const positionOfTile = this.#tileArray.indexOf(tile);
    const returnVal = {
      up: null as tileType | null,
      upRight: null as tileType | null,
      right: null as tileType | null,
      downRight: null as tileType | null,
      down: null as tileType | null,
      downLeft: null as tileType | null,
      left: null as tileType | null,
      upLeft: null as tileType | null,
    };

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

    return Object.values(returnVal).filter((elem) => {
      if (elem) {
        return elem;
      }
    }) as tileType[];
  }

  #markAroundMines() {
    for (let tile of this.#mineTiles) {
      const surrounding = this.#tileSurrounding(tile);

      for (let tile of surrounding) {
        if (!tile.mined) {
          tile.minesAround += 1;
        }
      }
    }

    for (let tile of this.#tileArray) {
      if (tile.minesAround) {
        tile.dom.innerHTML = `<p class = "mines-around-${tile.minesAround}">${tile.minesAround}</p>`;
      }
    }
  }

  #createBoard(settings: settingsType) {
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
        flagged: false,
        minesAround: 0,
      };
      this.#tileArray.push(tile);

      newDiv.className = 'closed';
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
    }
  }

  #eventsOnLoosing() {
    this.#mineTiles.forEach((elem) => {
      elem.open = true;
      elem.dom.className = 'open';
      elem.dom.innerHTML =
        '<img src="./assets/img/mine.svg" class="mine" alt="red-flag" loading="lazy">';
    });
    // --- remove event form the board
    const container = this.#board;
    const newContainer = container.cloneNode(true);
    (container.parentNode as HTMLElement).replaceChild(newContainer, container);
  }

  #clearEmptyTilesAround(tile: tileType) {
    // --- get the tiles around it
    const surrounding = this.#tileSurrounding(tile);
    for (let tile of surrounding) {
      if (!tile.open) {
        if (!tile.mined) {
          tile.dom.click();
        }
      }
    }
  }

  #leftClicksOnTiles() {
    for (let tile of this.#tileArray) {
      tile.dom.addEventListener('click', () => {
        tile.open = true;

        // --- if you hit a mine, ...
        if (tile.mined) {
          this.#eventsOnLoosing();
        } else {
          if (!tile.flagged) {
            // --- set tile open
            tile.dom.className = 'open';

            const p = tile.dom.querySelector('p') as HTMLElement;
            if (p) {
              p.style.display = 'block';
            }

            if (!tile.minesAround) {
              this.#clearEmptyTilesAround(tile);
            }
          }
        }
      });
    }
  }

  #rightClicksOnTiles() {
    for (let tile of this.#tileArray) {
      tile.dom.addEventListener('contextmenu', (event: Event) => {
        event.preventDefault();

        tile.flagged = !tile.flagged;

        if (tile.flagged) {
          tile.dom.innerHTML =
            '<img src="./assets/img/red-flag.svg" class="red-flag" alt="red-flag" loading="lazy">';
        } else {
          tile.dom.innerHTML = '';
        }
      });
    }
  }

  #createInfoBar() {
    this.#infoBar = document.createElement('div');
    this.#gameCont.append(this.#infoBar);
    this.#infoBar.className = 'info-bar';

    const timerCont = document.createElement('div');
    this.#infoBar.append(timerCont);
    timerCont.className = 'timer';

    this.#timer = new Timer(timerCont, 'min:sec:ms');
  }

  async start() {
    this.#settings = (await this.#settingsObj.run()) as settingsType;

    this.#createInfoBar();
    this.#createBoard(this.#settings);
    this.#speadMines(this.#settings.mines);
    this.#markAroundMines();
    this.#leftClicksOnTiles();
    this.#rightClicksOnTiles();

    this.#timer.start();

    // this.#timer.start();

    // --- prevent context menu on game board
    this.#board.addEventListener('contextmenu', (event: Event) => {
      event.preventDefault;
    });
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
