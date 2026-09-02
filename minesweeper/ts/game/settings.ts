import settingsFromFile from './settings.json' with { type: 'json' };

interface settingsType {
  rows: number;
  cols: number;
  mines: number;
}

class SettingsWindow {
  // --- set con constructor
  #settingsCont!: HTMLElement;
  #appCont: HTMLElement;
  #settings = {
    cols: 0,
    rows: 0,
    mines: 0,
  };
  #ulMinas!: HTMLUListElement;
  #ulTablero!: HTMLUListElement;
  #startBtn!: HTMLElement;

  constructor(appCont: HTMLElement) {
    this.#appCont = appCont;
  }

  #setEvents() {
    // --- board size and mine quantity selection events --- //
    const markLi = (li: HTMLElement) => {
      const clickedLi = li;

      // --- get its siblings
      const siblings = (clickedLi.parentElement as HTMLElement).children;

      // --- set all unselected
      for (let elem of siblings) {
        elem.className = 'unselected';
      }

      // --- set selected the clicked one
      clickedLi.className = 'selected';

      // --- index of the clicked li
      return Array.from(siblings).indexOf(clickedLi);
    };

    const boardSelectHandler = (event: Event) => {
      const clickedLi = event.target as HTMLElement;

      // --- get index of the clicked li and mark style it differently on css
      const selectedBoardIndex = markLi(clickedLi);

      // --- save the selected board size
      this.#settings.cols = settingsFromFile[selectedBoardIndex].boardSize.cols;
      this.#settings.rows = settingsFromFile[selectedBoardIndex].boardSize.rows;

      // --- get the mine options accordingly
      const mineOptions = settingsFromFile[selectedBoardIndex].mineOptions;

      // --- display mine options and set events on them
      this.#ulMinas.replaceChildren();

      const mineSelectHandler = (event: Event) => {
        const clickedLi = event.target as HTMLElement;

        // --- get index of the clicked li and mark style it differently on css
        const selectedMineIndex = markLi(clickedLi);

        // --- save the selected mine quantity
        this.#settings.mines =
          settingsFromFile[selectedBoardIndex].mineOptions[selectedMineIndex];
      };

      mineOptions.forEach((elem) => {
        const newLi = document.createElement('li');
        newLi.innerText = String(elem);
        this.#ulMinas.append(newLi);

        newLi.addEventListener('click', mineSelectHandler);
      });

      // --- click on the first mine option
      (this.#ulMinas.children[0] as HTMLElement).click();
    };

    settingsFromFile.forEach((elem) => {
      const newLi = document.createElement('li');
      newLi.innerText = `${elem.boardSize.rows}x${elem.boardSize.cols}`;
      this.#ulTablero.append(newLi);
      newLi.addEventListener('click', boardSelectHandler);
    });

    (this.#ulTablero.children[0] as HTMLElement).click();
  }

  #createWindow() {
    // --- window dom element
    this.#settingsCont = document.createElement('section');
    this.#settingsCont.className = 'settings';
    this.#appCont.append(this.#settingsCont);

    // --- tableros
    const h2Tablero = document.createElement('h2');
    this.#ulTablero = document.createElement('ul');
    h2Tablero.innerText = 'Tamaños de Tableros';
    this.#ulTablero.classList.add('board-sizes');

    // --- minas
    const h2Minas = document.createElement('h2');
    this.#ulMinas = document.createElement('ul');
    h2Minas.innerText = 'Cantidad de Minas';
    this.#ulMinas.classList.add('mine-options');

    // --- boton empezar
    this.#startBtn = document.createElement('button');
    this.#startBtn.innerText = 'EMPEZAR';

    // --- agregar todo
    this.#settingsCont.append(
      h2Tablero,
      this.#ulTablero,
      h2Minas,
      this.#ulMinas,
      this.#startBtn,
    );
  }

  async run() {
    this.#createWindow();
    this.#setEvents();

    return new Promise((resolve) => {
      // --- start button
      const startBtHandler = () => {
        this.#settingsCont.remove();
        resolve(this.#settings);
      };

      this.#startBtn.addEventListener('click', startBtHandler);
    });
  }
}

export { SettingsWindow, type settingsType };
