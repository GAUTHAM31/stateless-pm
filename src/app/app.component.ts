import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pm';
  password = ''

  updatePassword(newPassword: string) {
    this.password = newPassword;
  }
}
