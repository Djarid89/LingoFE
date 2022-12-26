import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CheckWordResult, GetWordResult, UpdateWordsData, UpdateWordsResult } from '../interface/lingo';

@Injectable({
  providedIn: 'root'
})
export class LingoService {

  constructor(private readonly http: HttpClient) { }

  getWord(size: number): Observable<GetWordResult> {
    return this.http.get<GetWordResult>(`${environment.baseHref}/lingo/getword/${size}`);
  }

  checkWord(word: string): Observable<CheckWordResult> {
    return this.http.get<CheckWordResult>(`${environment.baseHref}/lingo/checkword/${word}`);
  }

  updateLingoWords(words: string[]): Observable<UpdateWordsResult> {
    const params: UpdateWordsData = { words };
    return this.http.post<UpdateWordsResult>(`${environment.baseHref}/lingo/updatewords`, params);
  }
}
