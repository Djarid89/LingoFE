import { CellState } from "../interface/lingo";

export class Row {
  cells: Cell[];
  isCompleted: boolean;
  isEnabled: boolean;

  constructor(isEnabled: boolean, size: number, firstLetter: string) {
    this.cells = [];
    for(let i = 0; i < size; i++) {
      this.cells.push(new Cell(i === 0 ? firstLetter : '', i === 0 ? CellState.find : CellState.none));
    }
    this.isCompleted = false;
    this.isEnabled = isEnabled;
  }
}

export class Cell {
  letter: string;
  state: CellState;

  constructor(letter: string, state = CellState.none) {
    this.letter = letter;
    this.state = state;
  }
}