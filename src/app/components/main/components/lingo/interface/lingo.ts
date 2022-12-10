export interface GetWordResult {
  word: string;
}

export enum CellState {
  none = 0,
  present,
  find
}