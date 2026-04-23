import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  register(data: any): Observable<any> {
    // Uses standard JSON payload
    return this.api.post<any>('auth/register', data);
  }

  login(data: any): Observable<any> {
    // The backend uses a custom UserLogin Pydantic model (JSON) instead of FastAPI's default OAuth2PasswordRequestForm
    return this.api.post<any>('auth/login', {
      username_or_email: data.username,
      password: data.password
    });
  }

  getMe(): Observable<any> {
    // Automatically includes token if interceptor is set up.
    // For now, relies on authorization headers you might set later.
    return this.api.get<any>('auth/me');
  }
}
