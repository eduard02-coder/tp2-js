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
  #selectedBoardIndex!: number;

  constructor(appCont: HTMLElement) {
    this.#appCont = appCont;
  }

  #boardSelectEvents() {
    // --- set board sizes
    const eventHandler = (event: Event) => {
      const clickedLi = event.target as HTMLElement;

      // --- get its siblings
      const siblings = (clickedLi.parentElement as HTMLElement).children;

      // --- set all unselected
      for (let elem of siblings) {
        elem.className = 'unselected';
      }

      // --- set selected the clicked one
      clickedLi.className = 'selected';

      // --- index of the clicked li
      this.#selectedBoardIndex = Array.from(siblings).indexOf(clickedLi);

      // --- save the selected board size
      this.#settings.cols =
        settingsFromFile[this.#selectedBoardIndex].boardSize.cols;
      this.#settings.rows =
        settingsFromFile[this.#selectedBoardIndex].boardSize.rows;

      // --- get the mine options accordingly
      const mineOptions =
        settingsFromFile[this.#selectedBoardIndex].mineOptions;

      // --- display mine options
      this.#ulMinas.replaceChildren();

      mineOptions.forEach((elem) => {
        const newLi = document.createElement('li');
        newLi.innerText = String(elem);
        this.#ulMinas.append(newLi);
      });
    };

    settingsFromFile.forEach((elem) => {
      const newLi = document.createElement('li');
      newLi.innerText = `${elem.boardSize.rows}x${elem.boardSize.cols}`;
      this.#ulTablero.append(newLi);
      newLi.addEventListener('click', eventHandler);
    });

    (this.#ulTablero.children[0] as HTMLElement).click();
  }

  #mineSelectEvents() {
    const mineLis = this.#ulMinas.children;

    for (let li of mineLis) {
      li.addEventListener('click', () => {
        li.className = 'selected';
      });
    }
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
    const startBt = document.createElement('button');
    startBt.innerText = 'EMPEZAR';

    // --- agregar todo
    this.#settingsCont.append(
      h2Tablero,
      this.#ulTablero,
      h2Minas,
      this.#ulMinas,
      startBt,
    );
  }

  async run() {
    this.#createWindow();
    this.#boardSelectEvents();
    this.#mineSelectEvents();

    return this.#settings;
  }
}

export { SettingsWindow, type settingsType };
