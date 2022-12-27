export interface GetWordResult {
  word: string;
  error: string;
}

export interface CheckWordResult {
  valid: boolean;
}

export interface UpdateWordsData {
  words: string[];
}

export interface UpdateWordsResult {
  wordsAdded: string[];
  valid: boolean;
}

export enum CellState {
  none = 0,
  present,
  find,
  error
}