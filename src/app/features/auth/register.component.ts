import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      <!-- Background decorative blobs -->
      <div class="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none"></div>
      <div class="absolute top-[60%] -left-[10%] w-[60%] h-[60%] rounded-full bg-pink-500/10 blur-[100px] pointer-events-none"></div>

      <div class="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Create Account
        </h2>
        <p class="mt-2 text-center text-sm text-slate-400">
          Already have an account?
          <a routerLink="/login" class="font-medium text-purple-400 hover:text-purple-300 transition-colors">
            Sign in instead
          </a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div class="bg-slate-900/60 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-purple-500/10 sm:rounded-2xl sm:px-10 border border-white/5 border-t-white/10 relative group transition-all duration-500 hover:border-white/10">

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">

            <div>
              <label for="username" class="block text-sm font-medium text-slate-300">Username</label>
              <div class="mt-1 relative">
                <input id="username" type="text" formControlName="username" class="appearance-none block w-full px-4 py-3 border border-slate-700 bg-slate-950/50 rounded-xl shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-200 transition-all duration-300 sm:text-sm" placeholder="Choose a username">
                <p *ngIf="registerForm.get('username')?.touched && registerForm.get('username')?.invalid" class="mt-1 text-xs text-red-500 text-right">Username is required (min 3 chars)</p>
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-slate-300">Email Address</label>
              <div class="mt-1 relative">
                <input id="email" type="email" formControlName="email" class="appearance-none block w-full px-4 py-3 border border-slate-700 bg-slate-950/50 rounded-xl shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-200 transition-all duration-300 sm:text-sm" placeholder="you@example.com">
                <p *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid" class="mt-1 text-xs text-red-500 text-right">Valid email is required</p>
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-slate-300">Password</label>
              <div class="mt-1 relative">
                <input id="password" type="password" formControlName="password" class="appearance-none block w-full px-4 py-3 border border-slate-700 bg-slate-950/50 rounded-xl shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-200 transition-all duration-300 sm:text-sm" placeholder="Create a strong password">
              </div>
            </div>

            <div>
              <button type="submit" [disabled]="registerForm.invalid || isLoading" class="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
                <span *ngIf="!isLoading">Register details</span>
                <span *ngIf="isLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Creating...
                </span>
              </button>
            </div>

            <div *ngIf="errorMessage" class="mt-4 text-center p-3 bg-red-900/30 border border-red-500/50 rounded-lg">
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
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.invalid) return;
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Adjusting structure for typical register payload
    this.authService.register(this.registerForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.status === 'success') {
          this.successMessage = 'Registration successful! You can now sign in.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.errorMessage = res.message || 'Failed to register.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.error?.detail || 'Network error or server is down.';
      }
    });
  }
}
