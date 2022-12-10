import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Row, Cell } from './class/lingo';
import { GetWordResult } from './interface/lingo';
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

  constructor(public readonly lingoService: LingoService) {
    lingoService.getWord().pipe().subscribe({
      next: (getWordResult: GetWordResult) => {
        this.word = getWordResult.word.toUpperCase();
        for(let i = 0; i < this.size; i++) {
          this.rows.push(new Row(i === 0, this.size, this.word[0]));
        }
        this.emitShowProgressBar.emit(true);
      }
    });
  }

  setIsCompleted(attempt: Row): void {
    attempt.isCompleted = attempt.cells.every((cell: Cell) => cell.letter !== '');
    if(attempt.isCompleted) {
      this.emitShowProgressBar.emit(false);
    }
  }
}
