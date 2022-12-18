import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Row, Cell } from './class/lingo';
import { CellState, CheckWordResult, GetWordResult } from './interface/lingo';
import { LingoService } from './services/lingo.service';

@Component({
  selector: 'lng-lingo',
  templateUrl: './lingo.component.html',
  styleUrls: ['./lingo.component.scss']
})
export class LingoComponent implements OnChanges {
  @Input() size = 5;
  @Input() newGame = false;
  @Output() emitShowProgressBar = new EventEmitter<boolean>();
  word = '';
  wordDiscover = '';
  rows: Row[] = [];
  @ViewChild('row') rowsElements!: ElementRef[];

  constructor(public readonly lingoService: LingoService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.newGame?.currentValue) {
      this.getWord();
    }
  }

  getWord(): void {
    this.word = '';
    this.rows = [];
    this.lingoService.getWord(this.size).subscribe({
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
          } else {
            row.cells.forEach((cell: Cell, index: number) => {
              if(index === 0) {
                cell.letter = this.word[0];
                cell.state = CellState.find;
              }
            });
          }
          this.rows.push(row);
        }
        this.emitShowProgressBar.emit(true);
      }
    });
  }

  getRowStyle(): string {
    return `repeat(${this.rows.length}, 1fr)`;
  }
  
  setIsCompleted(row: Row, cell: Cell): void {
    row.cells.forEach((cell: Cell) => cell.isOnFocus = false);
    setTimeout(() => {
      if(row.cells.every((cell: Cell) => cell.letter !== '')) {
        this.tryWord();
        this.emitShowProgressBar.emit(false);
      } else if(cell.index + 1 < this.size) {
        row.cells[cell.index + 1].isOnFocus = true;
      }
    });
  }

  showWord(): void {
    this.wordDiscover = this.word;
    setTimeout(() => this.wordDiscover = '', 5000);
  }

  tryWord(): void {
    const rowOnTryIndex = this.rows.findIndex((row: Row) => row.isOnTry);
    const rowOnTry = this.rows[rowOnTryIndex];
    
    let word = '';
    rowOnTry.cells.forEach((cell: Cell) => word += cell.letter);

    const nextRowOnTry = rowOnTryIndex + 1 < this.size ? this.rows[rowOnTryIndex + 1] : null;
    this.lingoService.checkWord(word).subscribe({
      next: (checkWordResult: CheckWordResult) => {
        if(!checkWordResult.valid) {
          rowOnTry.cells.forEach((cell: Cell) => cell.state = CellState.error);
        } else {
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
            } else {
              const letterPresentIndex = letterNotFinded.findIndex((letter: string) => letter === cell.letter); 
              if(letterPresentIndex !== -1) {
                cell.state = CellState.present;
                letterNotFinded.splice(letterPresentIndex, 1);
              }
            }
            cell.isDisabled = true;
          });

          this.rows.forEach((row: Row) => {
            row.cells.forEach((cell: Cell, index: number) => {
              if(cell.state === CellState.find && nextRowOnTry) {
                nextRowOnTry.cells[index].letter = cell.letter;
              }
            });
          })
        }

        rowOnTry.isOnTry = false;
        if(nextRowOnTry) {
          nextRowOnTry.isOnTry = true;
          nextRowOnTry.isVisible = true;
          let focusAssigned = false;
          nextRowOnTry.cells.forEach((cell: Cell) => {
            cell.isDisabled = false;
            if(cell.letter === '' && !focusAssigned) {
              cell.isOnFocus = true;
              focusAssigned = true;
            }
          });
        }
      }
    });
  }
}
