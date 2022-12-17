import { CellState } from "../interface/lingo";

export class Row {
  cells: Cell[];
  isVisible: boolean;
  isOnTry: boolean;

  constructor(size: number) {
    this.cells = [];
    for(let i = 0; i < size; i++) {
      this.cells.push(new Cell(''));
    }
    this.isVisible = false;
    this.isOnTry = false;
  }
}

export class Cell {
  letter: string;
  state: CellState;
  isDisabled: boolean;
  isOnFocus: boolean;

  constructor(letter: string, state = CellState.none) {
    this.letter = letter;
    this.state = state;
    this.isDisabled = true;
    this.isOnFocus = false;
  }
}