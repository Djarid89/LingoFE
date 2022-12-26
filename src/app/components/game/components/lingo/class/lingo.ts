import { CellState } from "../interface/lingo";

export class Row {
  cells: Cell[];
  isVisible: boolean;
  isOnTry: boolean;

  constructor(size: number) {
    this.cells = [];
    for(let i = 0; i < size; i++) {
      this.cells.push(new Cell(i, ''));
    }
    this.isVisible = false;
    this.isOnTry = false;
  }
}

export class Cell {
  index: number;
  letter: string;
  state: CellState;
  isDisabled: boolean;
  isOnFocus: boolean;

  constructor(index: number, letter: string, state = CellState.none) {
    this.index = index;
    this.letter = letter;
    this.state = state;
    this.isDisabled = true;
    this.isOnFocus = false;
  }
}