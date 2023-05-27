import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private appStorageService: StorageService
  ) {}

  regex_username = '^[a-zA-Z0-9]{6,}$';

  form_login = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.pattern(this.regex_username),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(11),
    ]),
  });

  username: string = '';
  password: string = '';

  ngOnInit() {}

  async loginUser() {
    if (this.form_login.valid) {
      this.username = this.form_login.value.username as string;
      this.password = this.form_login.value.password as string;

      const res = await this.authService.login(this.username, this.password);

      if (res.data.token && res.data.user) {
        // Guardar token en local storage
        await this.appStorageService.set('token', res.data.token);
        await this.appStorageService.set('user', JSON.stringify(res.data.user));

        // Redireccionar a home
        await this.router.navigate(['/home']);
        this.form_login.reset();
      }
    } else {
      console.log('Invalid form');
      await this.router.navigate(['/login']);
    }
  }
}
