export interface GetWordResult {
  word: string;
}

export interface CheckWordResult {
  valid: boolean;
}

export enum CellState {
  none = 0,
  present,
  find,
  error
}