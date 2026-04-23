import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  /**
   * Perform a GET request.
   * @param endpoint The API endpoint (e.g., 'users' or 'auth/login')
   */
  get<T>(endpoint: string): Observable<T> {
    const url = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return this.http.get<T>(`${this.baseUrl}/${url}`);
  }

  /**
   * Perform a POST request.
   * @param endpoint The API endpoint
   * @param body The payload for the post request
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    const url = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return this.http.post<T>(`${this.baseUrl}/${url}`, body);
  }

  /**
   * Perform a PUT request.
   * @param endpoint The API endpoint
   * @param body The payload for the put request
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    const url = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return this.http.put<T>(`${this.baseUrl}/${url}`, body);
  }

  /**
   * Perform a DELETE request.
   * @param endpoint The API endpoint
   */
  delete<T>(endpoint: string): Observable<T> {
    const url = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return this.http.delete<T>(`${this.baseUrl}/${url}`);
  }
}
