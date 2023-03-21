import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form_login = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router) {}

  ngOnInit() {}

  loginUser() {
    if (this.form_login.valid) {
      console.log(this.form_login.value);
      this.router.navigate(['/home']);
    } else {
      console.log('Invalid form');
      this.router.navigate(['/login']);
    }
  }
}
