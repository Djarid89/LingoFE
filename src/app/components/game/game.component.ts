import { Component, OnInit } from '@angular/core';
import { Player } from './class/game';

@Component({
  selector: 'lng-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  showProgressBar = false;
  newGame = false;
  timeIsUp = false;
  resetProgressBar = false;
  stopProgressBar = false;
  size = 5;
  players: Player[] = [];

  constructor() {}

  ngOnInit(): void {
    this.players = window.history.state.players as Player[];
  }

  setShowProgressBar(showProgressBar: boolean): void {
    this.showProgressBar = showProgressBar;
  }

  setNewGame(): void {
    this.newGame = true;
    this.setResetProgressBar();

    const index = this.players?.findIndex((player: Player) => player.myTurn);
    if(index === -1) {
      this.players[0].innerMyTurn = true;
      this.players[0].myTurn = true;
    } else {
      let nextPlayerIndex = index + 1;
      if(nextPlayerIndex >= this.players.length) {
        nextPlayerIndex = 0;
      }
      this.players[index].myTurn = false;
      this.players[nextPlayerIndex].myTurn = true;
      this.players.forEach((player: Player) => player.innerMyTurn = player.myTurn);
    }

    setTimeout(() => this.newGame = false);
  }

  setTimeIsUp(): void {
    this.timeIsUp = true;
    setTimeout(() => this.timeIsUp = false);
  }

  setResetProgressBar(): void {
    this.resetProgressBar = true;
    setTimeout(() => this.resetProgressBar = false);
  }

  setStopProgressBar(): void {
    this.stopProgressBar = true;
    setTimeout(() => this.stopProgressBar = false);
  }
}
