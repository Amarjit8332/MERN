import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
    // Hardcoded credentials
    private readonly validUsername: string = 'admin';
    private readonly validPassword: string = 'password123';

    constructor(private router: Router) {}

    login() {
      if (this.username === this.validUsername && this.password === this.validPassword) {
        // Simulate a successful login
        localStorage.setItem('token', 'dummy-token');
        this.router.navigate(['/dashboard']);
      } else {
        alert('Invalid login credentials');
      }
    }
  }