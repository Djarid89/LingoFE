export class Player {
  name: string;
  myTurn: boolean;
  innerMyTurn: boolean;
  score: number;

  constructor(name: string) {
    this.name = name;
    this.myTurn = false
    this.innerMyTurn = false;
    this.score = 0;
  }
}