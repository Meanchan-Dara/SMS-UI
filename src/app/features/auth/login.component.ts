import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      <!-- Background decorative blobs -->
      <div class="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/20 blur-[120px] pointer-events-none"></div>
      <div class="absolute top-[60%] left-[60%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none"></div>

      <div class="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          Welcome Back
        </h2>
        <p class="mt-2 text-center text-sm text-slate-400">
          Or
          <a routerLink="/register" class="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
            create a new account
          </a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div class="bg-slate-900/60 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-emerald-500/10 sm:rounded-2xl sm:px-10 border border-white/5 border-t-white/10 relative group transition-all duration-500 hover:border-white/10">
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-slate-300">Email</label>
              <div class="mt-1 relative">
                <input id="email" type="text" formControlName="email" class="appearance-none block w-full px-4 py-3 border border-slate-700 bg-slate-950/50 rounded-xl shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-200 transition-all duration-300 sm:text-sm" placeholder="Enter your email">
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-slate-300">Password</label>
              <div class="mt-1 relative">
                <input id="password" type="password" formControlName="password" class="appearance-none block w-full px-4 py-3 border border-slate-700 bg-slate-950/50 rounded-xl shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-200 transition-all duration-300 sm:text-sm" placeholder="Enter your password">
              </div>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" type="checkbox" class="h-4 w-4 text-emerald-500 focus:ring-emerald-500 border-slate-700 rounded bg-slate-900 cursor-pointer">
                <label for="remember-me" class="ml-2 block text-sm text-slate-400 cursor-pointer">Remember me</label>
              </div>
              <div class="text-sm">
                <a href="javascript:void(0)" class="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">Forgot your password?</a>
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="loginForm.invalid || isLoading" class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
                <span *ngIf="!isLoading">Sign in</span>
                <span *ngIf="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-900" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Processing...
                </span>
              </button>
            </div>
            
            <div *ngIf="errorMessage" class="mt-4 text-center p-3 bg-red-900/30 border border-red-500/50 rounded-lg animate-pulse">
              <p class="text-sm text-red-400">{{ errorMessage }}</p>
            </div>
            
            <div *ngIf="successMessage" class="mt-4 text-center p-3 bg-emerald-900/30 border border-emerald-500/50 rounded-lg">
              <p class="text-sm text-emerald-400">{{ successMessage }}</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 'success') {
          this.successMessage = 'Login successful! Redirecting...';
          // e.g., localStorage.setItem('token', res.data.access_token);
        } else {
          this.errorMessage = res.message || 'Invalid credentials.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.error?.detail || 'Network error or server is down.';
      }
    });
  }
}
