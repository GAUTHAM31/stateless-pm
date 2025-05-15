import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'pm';
  password = '';
  passwordLength = 16;

  updatePassword(newPassword: string) {
    this.password = newPassword;
  }
  updatePasswordLength(passwordLength: number) {
    this.passwordLength = passwordLength;
  }
  copyPassword() {
    navigator.clipboard.writeText(this.password)
        .then()
        .catch((e) => console.log(e));
  }
}
