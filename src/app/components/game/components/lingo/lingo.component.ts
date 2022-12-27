import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Player } from '../../class/game';
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
  @Input() players: Player[] = [];
  @Output() emitResetProgressBar = new EventEmitter<void>();
  @Output() emitStopProgressBar = new EventEmitter<void>();
  @Output() emitShowProgressBar = new EventEmitter<boolean>();
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler() {
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
      this.setErrorNextWord(this.rows.findIndex((row: Row) => row.isOnTry));
    }
  }

  getWord(): void {
    this.word = '';
    this.rows = [];
    this.lingoService.getWord(this.size).subscribe({
      next: (getWordResult: GetWordResult) => {
        if(getWordResult.error) {
          alert(getWordResult.error);
          return;
        }

        this.word = getWordResult.word.toUpperCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
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

  tryWord(): void {
    const rowOnTryIndex = this.rows.findIndex((row: Row) => row.isOnTry);
    const rowOnTry = this.rows[rowOnTryIndex];
    let word = this.composeWordFromCells(rowOnTry);
    this.findDoubleWord(rowOnTry, word, rowOnTryIndex);

    this.lingoService.checkWord(word).subscribe({
      next: (checkWordResult: CheckWordResult) => {
        if(!checkWordResult.valid) {
          this.setErrorNextWord(rowOnTryIndex);
          return;
        } 
        
        const letterNotFinded = this.getLetterNotFinded(rowOnTry);
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
          const currentPlayer = this.players.find((player: Player) => player.innerMyTurn) as Player;
          currentPlayer.score++;
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

  private getLetterNotFinded(rowOnTry: Row): string [] {
    const result = []; 
    let index = 0;
    for(const letter of this.word) {
      if(letter !== rowOnTry.cells[index].letter) {
        result.push(letter);
      }
      index++;
    }
    return result;
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
    });
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

  private setErrorNextWord(rowOnTryIndex: number): void {
    const rowOnTry = this.rows[rowOnTryIndex];
    rowOnTry?.cells.forEach((cell: Cell) => {
      cell.state = CellState.error
      cell.isDisabled = true;
      cell.isOnFocus = false;
    });
    rowOnTry.isOnTry = false;
    this.emitStopProgressBar.emit();
    
    const index = this.players.findIndex((player: Player) => player.innerMyTurn);
    if(index === -1) {
      return;
    }

    let nextPlayerIndex = index + 1;
    if(nextPlayerIndex >= this.players.length) {
      nextPlayerIndex = 0;
    }
    this.players[index].innerMyTurn = false;
    this.players[nextPlayerIndex].innerMyTurn = true;

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
    const validWords = this.getValidWords();
    this.lingoService.updateLingoWords(validWords).subscribe({
      next: (updateWordsResult: UpdateWordsResult) => {
        if(!updateWordsResult.valid ) {
          alert('Si è rotto qualcosa durante l\'update del lingoWords.txt');
        }

        if(updateWordsResult.wordsAdded?.length) {
          alert(`Aggiunte al dizionario: ${updateWordsResult.wordsAdded.join(',')}`)
        }
      }
    });
  }

  private findDoubleWord(rowOnTry: Row, word: string, rowOnTryIndex: number): void {
    for(let row of this.rows) {
      if(row === rowOnTry) {
        continue;
      }
      const rowWord = this.composeWordFromCells(row);
      if(rowWord === word) {
        this.setErrorNextWord(rowOnTryIndex);
        return;
      }
    };
  }
}
