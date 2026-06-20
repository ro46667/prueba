import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match, ApiResponse } from '../models/match.model';

@Injectable({ providedIn: 'root' })
export class MatchService {
  private readonly apiUrl = 'http://localhost:3000/api/matches';

  constructor(private http: HttpClient) {}

  getMatches(): Observable<ApiResponse<Match[]>> {
    return this.http.get<ApiResponse<Match[]>>(this.apiUrl);
  }

  getMatchById(id: number): Observable<ApiResponse<Match>> {
    return this.http.get<ApiResponse<Match>>(`${this.apiUrl}/${id}`);
  }

  createMatch(match: Partial<Match>): Observable<ApiResponse<Match>> {
    return this.http.post<ApiResponse<Match>>(this.apiUrl, match);
  }

  updateMatch(id: number, match: Partial<Match>): Observable<ApiResponse<Match>> {
    return this.http.put<ApiResponse<Match>>(`${this.apiUrl}/${id}`, match);
  }

  deleteMatch(id: number): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`);
  }
}
