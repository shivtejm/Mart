import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface User {
  name?: string;
  email: string;
  password?: string;
}

export interface AuthResponse {
  message: string;
  email?: string;
  name?: string;
}

export interface ProfileResponse {
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';

  readonly currentUser = signal<ProfileResponse | null>(this.getStoredUser());

  constructor(private http: HttpClient) {}

  private getStoredUser(): ProfileResponse | null {
    const email = localStorage.getItem('userEmail');
    const name = localStorage.getItem('userName') || '';
    if (email) {
      return { name, email };
    }
    return null;
  }

  register(user: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/register`,
      user,
      {
        withCredentials: true
      }
    );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      credentials,
      {
        withCredentials: true
      }
    ).pipe(
      tap((res) => {
        const user: ProfileResponse = {
          name: res.name || '',
          email: res.email || credentials.email
        };
        this.currentUser.set(user);
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.name);
        localStorage.setItem('isLoggedIn', 'true');
      })
    );
  }

  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/logout`,
      {},
      {
        withCredentials: true
      }
    ).pipe(
      tap({
        next: () => this.clearSession(),
        error: () => this.clearSession()
      })
    );
  }

  clearSession(): void {
    this.currentUser.set(null);
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
  }

  getProfile(): Observable<ProfileResponse> {
    return this.http.get<ProfileResponse>(
      `${this.apiUrl}/profile`,
      {
        withCredentials: true
      }
    ).pipe(
      tap((profile) => {
        this.currentUser.set(profile);
        localStorage.setItem('userEmail', profile.email);
        localStorage.setItem('userName', profile.name);
        localStorage.setItem('isLoggedIn', 'true');
      })
    );
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true' || !!localStorage.getItem('userEmail');
  }
}