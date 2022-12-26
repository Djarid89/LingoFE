import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Player } from '../game/class/game';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  @HostListener('document:keydown.enter', ['$event']) onKeydownHandler() {
    if(this.playerName === '') {
      return;
    }
    this.players.push(new Player(this.playerName));
    this.playerName = '';
  }

  players: Player[] = [];
  playerName = '';

  constructor(private readonly router: Router) {}

  startGame(): void {
    this.router.navigate(['/game'], { state: { players: this.players } });
  }
}
