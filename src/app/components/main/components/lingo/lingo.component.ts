import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Row, Cell } from './class/lingo';
import { CellState, CheckWordResult, GetWordResult, UpdateWordsResult } from './interface/lingo';
import { LingoService } from './services/lingo.service';

@Component({
  selector: 'lng-lingo',
  templateUrl: './lingo.component.html',
  styleUrls: ['./lingo.component.scss']
})
export class LingoComponent implements OnChanges {
  @Input() size = 5;
  @Input() newGame = false;
  @Input() timeIsUp = false;
  @Output() emitResetProgressBar = new EventEmitter<void>();
  @Output() emitStopProgressBar = new EventEmitter<void>();
  @Output() emitShowProgressBar = new EventEmitter<boolean>();
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const rowOnTry = this.rows.find((row: Row) => row.isOnTry);
    if(!rowOnTry) {
      return;
    }
    if(rowOnTry.cells.every((cell: Cell) => cell.letter !== '')) {
      this.tryWord();
    }
}
  word = '';
  wordDiscover = '';
  rows: Row[] = [];
  @ViewChild('row') rowsElements!: ElementRef[];

  constructor(public readonly lingoService: LingoService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.newGame?.currentValue) {
      this.getWord();
    } else if(changes.timeIsUp?.currentValue) {
      this.setErrorNextWord();
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
  
  setFocus(row: Row, cell: Cell): void {
    row.cells.forEach((cell: Cell) => cell.isOnFocus = false);
    this.emitStopProgressBar.emit();
    setTimeout(() => {
      if(cell.index + 1 < this.size) {
        row.cells[cell.index + 1].isOnFocus = true;
      }
    });
  }

  showWord(): void {
    this.wordDiscover = this.word;
    setTimeout(() => this.wordDiscover = '', 5000);
  }

  private setNext(nextRowOnTry: Row | null): void {
    if(!nextRowOnTry) {
      return ;
    }

    this.rows.forEach((row: Row) => {
      row.cells.forEach((cell: Cell, index: number) => {
        if(cell.state === CellState.find) {
          nextRowOnTry.cells[index].letter = cell.letter;
        }
      });
    })
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

  private getValidWords(): string[] {
    const validWords: string[] = [];
    this.rows.forEach((row: Row) => {
      if(row.cells.every((cell : Cell) => cell.state !== CellState.error)) {
        validWords.push(this.composeWordFromCells(row));
      }
    });

    return validWords;
  }

  private composeWordFromCells(row: Row): string {
    let word = '';
    row.cells.forEach((cell: Cell) => word += cell.letter);
    return word;
  }

  private setErrorNextWord(): void {
    const rowOnTryIndex = this.rows.findIndex((row: Row) => row.isOnTry);
    const rowOnTry = this.rows[rowOnTryIndex];
    rowOnTry?.cells.forEach((cell: Cell) => cell.state = CellState.error);
    rowOnTry?.cells.forEach((cell: Cell) => cell.isDisabled = true);
    rowOnTry?.cells.forEach((cell: Cell) => cell.isOnFocus = false);
    rowOnTry.isOnTry = false;
    this.emitStopProgressBar.emit();
    setTimeout(() => {
      const nextRowOnTry = rowOnTryIndex + 1 < this.size ? this.rows[rowOnTryIndex + 1] : null;
      this.setNext(nextRowOnTry);
      if(nextRowOnTry !== null) {
        this.emitResetProgressBar.emit();
      } else {
        this.updateLingoWords();
      }
    }, 1500);
  }

  private updateLingoWords(): void {
    this.lingoService.updateLingoWords(this.getValidWords()).subscribe({
      next: (updateWordsResult: UpdateWordsResult) => {
        if(!updateWordsResult.valid) {
          alert('Si è rotto qualcosa durante l\'update del lingoWords.txt');
        }
      }
    });
  }

  tryWord(): void {
    const rowOnTryIndex = this.rows.findIndex((row: Row) => row.isOnTry);
    const rowOnTry = this.rows[rowOnTryIndex];
    let word = this.composeWordFromCells(rowOnTry);
    for(let row of this.rows) {
      if(row === rowOnTry) {
        continue;
      }
      const rowWord = this.composeWordFromCells(row);
      if(rowWord === word) {
        this.setErrorNextWord();
        return;
      }
    };
    this.lingoService.checkWord(word).subscribe({
      next: (checkWordResult: CheckWordResult) => {
        if(!checkWordResult.valid) {
          this.setErrorNextWord();
          return;
        } 
        
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
        rowOnTry.isOnTry = false;

        if(rowOnTry.cells.every((cell: Cell) => cell.state === CellState.find)) {
          this.updateLingoWords();
          this.emitStopProgressBar.emit();
          return;
        }

        const nextRowOnTry = rowOnTryIndex + 1 < this.size ? this.rows[rowOnTryIndex + 1] : null;
        this.setNext(nextRowOnTry);

        if(nextRowOnTry !== null) {
          this.emitResetProgressBar.emit();
        } else {
          this.emitStopProgressBar.emit();
          this.updateLingoWords();
        }
      }
    });
  }
}
