import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetWordResult } from '../interface/lingo';

@Injectable({
  providedIn: 'root'
})
export class LingoService {

  constructor(private readonly http: HttpClient) { }

  getWord(): Observable<GetWordResult> {
    return this.http.get<GetWordResult>(`${environment.baseHref}/lingo/getword`);
  }
}
