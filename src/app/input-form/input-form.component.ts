import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormGroup, FormBuilder} from '@angular/forms';
import {FirstLastNumber} from '../models/password-generator.interface';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css'],
})

export class InputFormComponent {
  masterInputForm: FormGroup;
  @Input() genPassword: string = 'Password';
  @Output() passwordUpdated = new EventEmitter<string>();

  constructor(private fb:FormBuilder) {
    this.masterInputForm = this.buildMasterForm();
  }


  private buildMasterForm() {
    return this.fb.group({
      url: '',
      key: '',
      salt: '',
    });
  }

  public onSave(form: FormGroup) {
    this.generatePassword(form.value.url, form.value.key, form.value.salt);
  }

  private generatePassword(url: string, key: string, salt: string = ''): void {
    console.log(this.extractMainDomain(url));
    const mainUrl = this.extractMainDomain(url);
    const combinedString = mainUrl + key + salt;
    this.digestMessage(combinedString).then((updatedPassword) => {
      this.genPassword = this.addSplCharAndUpperCase(updatedPassword.slice(0, 16));
      this.passwordUpdated.emit(this.genPassword);
    });
  }

  private extractMainDomain(url: string): string {
    try {
      // Add protocol if missing
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }

      // Extract the main domain from the URL
      const hostname = new URL(url).hostname;
      const parts = hostname.split('.').filter((part) => part !== 'www');
      if (parts.length > 2) {
        return parts.slice(-2).join('.');
      }
      return parts.join('.');
    } catch (error) {
      console.error('Invalid URL:', error);
      return '';
    }
  }

  /**
   * @param message - The string to hash.
   */
  private async digestMessage(message: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string

    return hashHex;
  }

  private addSplCharAndUpperCase(hash: string) {
    const {first, last} = this.getFirstOrLastNumber(hash);
    const splChar = this.numberToSpecialChar(last);
    hash = hash.slice(0, first).toUpperCase() + splChar + hash.slice(first);

    return hash;
  }

  private getFirstOrLastNumber(str: string): FirstLastNumber {
    // Regular expression to find all numbers in the string
    const matches = str.match(/\d/g);

    if (!matches) {
      return {first: 1, last: 9}; // Default
    }
    const firstInt = parseInt(matches[0], 10);
    const lastInt = parseInt(matches[matches.length - 1], 10);
    return {first: firstInt, last: lastInt};
  }

  private numberToSpecialChar(num: number): string {
    // Define a mapping of numbers to special characters
    const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

    // Check if the number is between 0-9, otherwise return an empty string
    if (num >= 0 && num <= 9) {
      return specialChars[num];
    } else {
      return '@';// Default
    }
  }
}
