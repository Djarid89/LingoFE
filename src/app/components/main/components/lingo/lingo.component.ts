import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Row, Cell } from './class/lingo';
import { CellState, GetWordResult } from './interface/lingo';
import { LingoService } from './services/lingo.service';

@Component({
  selector: 'lng-lingo',
  templateUrl: './lingo.component.html',
  styleUrls: ['./lingo.component.scss']
})
export class LingoComponent {
  @Input() size = 5;
  @Output() emitShowProgressBar = new EventEmitter<boolean>();
  word!: string;
  rows: Row[] = [];
  @ViewChild('row') rowsElements!: ElementRef[];

  constructor(public readonly lingoService: LingoService) {
    lingoService.getWord(this.size).pipe().subscribe({
      next: (getWordResult: GetWordResult) => {
        this.word = getWordResult.word.toUpperCase();
        for(let i = 0; i < this.size; i++) {
          const row = new Row(this.size);
          if(i === 0) {
            row.isOnTry = true;
            row.isVisible = true
            row.cells.forEach((cell: Cell, index: number) => {
              if(index === 0) {
                cell.letter = this.word[0];
                cell.state = CellState.find;
              } else if(index === 1) {
                cell.isOnFocus = true;
              }
              cell.isDisabled = false
            });
          }
          this.rows.push(row);
        }
        this.emitShowProgressBar.emit(true);
      }
    });
  }

  getRowStyle(): string {
    return `repeat(${this.size}, 1fr)`;
  }
  
  setIsCompleted(row: Row): void {
    if(row.cells.every((cell: Cell) => cell.letter !== '')) {
      this.tryWord();
      this.emitShowProgressBar.emit(false);
    } else {
      let indexCellOnFocus = row.cells.findIndex((cell: Cell) => cell.isOnFocus);
      if(indexCellOnFocus === -1) {
        return;
      }
      const cellOnFocus = row.cells[indexCellOnFocus];
      cellOnFocus.isOnFocus = false;
      let counter = 0;
      while(true) {
        indexCellOnFocus++;
        if(indexCellOnFocus === this.size) {
          indexCellOnFocus = 0;
        }

        if(row.cells[indexCellOnFocus].letter === '') {
          row.cells[indexCellOnFocus].isOnFocus = true;
          break;
        }

        counter++;
        if(counter === this.size - 3) {
          break;
        }
      }
    }
  }

  tryWord(): void {
    const rowOnTryIndex = this.rows.findIndex((row: Row) => row.isOnTry);
    const rowOnTry = this.rows[rowOnTryIndex];
    const nextRowOnTry = rowOnTryIndex + 1 < this.size ? this.rows[rowOnTryIndex + 1] : null;

    let letterNotFinded: string[] = [];
    let index = 0;
    for(const letter of this.word) {
      if(letter !== rowOnTry.cells[index].letter) {
        letterNotFinded.push(letter);
      }
      index++;
    }

    rowOnTry?.cells.forEach((cell: Cell, index: number) => {
      if(cell.letter === this.word[index]) {
        cell.state = CellState.find;
        if(nextRowOnTry) {
          nextRowOnTry.cells[index].letter = cell.letter;
          nextRowOnTry.cells[index].state = CellState.find;
        }
      } else {
        const letterPresentIndex = letterNotFinded.findIndex((letter: string) => letter === cell.letter); 
        if(letterPresentIndex !== -1) {
          cell.state = CellState.present;
          letterNotFinded.splice(letterPresentIndex, 1);
        }
      }
      cell.isDisabled = true;
    });

    rowOnTry.isOnTry = false;
    if(nextRowOnTry) {
      nextRowOnTry.isOnTry = true;
      nextRowOnTry.isVisible = true;
      let focusAssigned = false;
      nextRowOnTry.cells.forEach((cell: Cell) => {
        cell.isDisabled = false;
        if(cell.state === CellState.none && !focusAssigned) {
          cell.isOnFocus = true;
          focusAssigned = true;
        }
      });
    }
  }
}
