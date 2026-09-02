import { SettingsWindow, type settingsType } from './settings.ts';
import { Timer } from './timer.ts';

interface tileType {
  dom: HTMLElement;
  mined: boolean;
  open: boolean;
  flagged: boolean;
  minesAround: number;
  flagImgDom: HTMLElement;
  pDom: HTMLElement;
}

class MineSweeper {
  // --- set con constructor
  #settingsObj: SettingsWindow;
  #appCont: HTMLElement;

  // --- set later on
  #gameCont!: HTMLElement;
  #board!: HTMLElement;
  #tileArray: tileType[] = [];
  #mineTiles: tileType[] = [];
  #settings!: settingsType;
  #infoBar!: HTMLElement;
  #timer!: Timer;
  #flags!: number;
  #mines!: number;
  #flagCounter!: HTMLElement;
  #emoji!: HTMLElement;

  constructor(MineSweeperContainer: HTMLElement) {
    this.#appCont = MineSweeperContainer;
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
        tile.pDom.outerHTML = `<p class = "mines-around-${tile.minesAround}">${tile.minesAround}</p>`;
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

      newDiv.className = 'closed';
      const p = document.createElement('p');
      const img = document.createElement('img');
      img.src = './assets/img/red-flag.svg';
      img.className = 'red-flag';
      newDiv.append(p, img);

      const tile = {
        dom: newDiv,
        open: false,
        mined: false,
        flagged: false,
        minesAround: 0,
        flagImgDom: img,
        pDom: p,
      };
      this.#tileArray.push(tile);
    }

    this.#board.style.display = 'grid';
    this.#board.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    this.#board.style.gridTemplateRows = `repeat(${rows}, 30px)`;
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
        '<img src="./assets/img/mine.svg" class="mine" alt="mine" loading="lazy">';
    });
    this.#removeEventsFromBoard();
    this.#timer.stop();
    this.#emoji.innerText = '😵';

    this.#emergentBar('¡Has Perdido!');
  }

  #eventsOnWinning() {
    this.#timer.stop();
    this.#removeEventsFromBoard();
    this.#emergentBar('¡Has Ganado!');
  }

  #removeEventsFromBoard() {
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
        this.#timer.start();
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
        this.#timer.start();

        const plantFlag = () => {
          tile.flagged = true;
          tile.flagImgDom.style.display = 'block';
          this.#flags -= 1;
          if (tile.mined) {
            this.#mines -= 1;

            if (!this.#mines) {
              this.#eventsOnWinning();
            }
          }
        };

        const removeFlag = () => {
          tile.flagged = false;
          tile.flagImgDom.style.display = 'none';
          this.#flags += 1;
          if (tile.mined) {
            this.#mines += 1;
          }
        };

        if (!tile.open) {
          if (!tile.flagged) {
            if (this.#flags) {
              plantFlag();
            }
          } else {
            removeFlag();
          }
        }

        this.#flagCounter.innerText = String(this.#flags);
      });
    }
  }

  #createInfoBar() {
    // --- info bar
    this.#infoBar = document.createElement('div');
    this.#gameCont.append(this.#infoBar);
    this.#infoBar.className = 'info-bar';

    // --- timer
    const timerCont = document.createElement('div');
    const p = document.createElement('p');
    p.innerText = '00:00';
    timerCont.append(p);

    this.#timer = new Timer(p);
    timerCont.className = 'timer';

    // --- emoji
    this.#emoji = document.createElement('div');
    this.#emoji.innerText = '😃';
    this.#emoji.className = 'emoji';

    // --- mine counter
    const mineCounterContainer = document.createElement('div');
    mineCounterContainer.className = 'mine-counter';
    mineCounterContainer.innerHTML =
      '<img src="./assets/img/mine.svg" class="mine" alt="mine" loading="lazy">';
    this.#flagCounter = document.createElement('span');
    this.#flagCounter.innerText = String(this.#flags);
    mineCounterContainer.append(this.#flagCounter);

    // --- append everything
    this.#infoBar.append(timerCont, this.#emoji, mineCounterContainer);
  }

  #deleteEverything() {
    this.#gameCont.remove();
    this.#tileArray.length = 0;
    this.#tileArray = [];
    this.#mineTiles.length = 0;
    this.#mineTiles = [];
  }

  #emergentBar(message: string) {
    const newDiv = document.createElement('div');
    this.#gameCont.append(newDiv);
    newDiv.className = 'emergent-bar';

    const restartBtn = document.createElement('button');
    const newGamebtn = document.createElement('button');

    restartBtn.innerText = 'Reiniciar';
    newGamebtn.innerText = 'Nueva Partida';

    restartBtn.addEventListener('click', () => {
      this.#deleteEverything();
      this.#startGame(this.#settings);
    });

    newGamebtn.addEventListener('click', () => {
      this.#deleteEverything();
      this.run();
    });

    const innerDiv = document.createElement('div');
    innerDiv.append(restartBtn, newGamebtn);

    const p = document.createElement('p');
    p.className = 'message';
    if (message.length) {
      p.innerText = message;
    }

    newDiv.append(innerDiv, p);
  }

  #startGame(settings: settingsType) {
    this.#gameCont = document.createElement('div');
    this.#gameCont.className = 'game';
    this.#appCont.append(this.#gameCont);

    this.#flags = settings.mines;
    this.#mines = settings.mines;

    this.#createInfoBar();
    this.#createBoard(this.#settings);

    this.#speadMines(this.#settings.mines);
    this.#markAroundMines();

    this.#leftClicksOnTiles();
    this.#rightClicksOnTiles();

    this.#board.addEventListener(
      'contextmenu',
      (event: Event) => {
        event.preventDefault;
      },
      {
        once: true,
      },
    );
  }

  async run() {
    this.#settings = (await this.#settingsObj.run()) as settingsType;
    this.#startGame(this.#settings);
  }
}

async function main() {
  const MineSweeperContainer = document.getElementById(
    'minesweeper',
  ) as HTMLElement;

  let game = new MineSweeper(MineSweeperContainer);
  game.run();
}

main();

// --------------------------------
