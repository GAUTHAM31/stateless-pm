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
  @Input() passwordLengthFromParent: number = 16;

  constructor(private fb: FormBuilder) {
    this.masterInputForm = this.buildMasterForm();
  }

  /**
   * Builds and initializes the reactive form.
   * @return {FormGroup} The reactive form group.
   */
  private buildMasterForm(): FormGroup {
    return this.fb.group({
      url: '',
      key: '',
      salt: '',
    });
  }

  /**
   * Handles form submission and generates a new password.
   * @param {FormGroup} form - The submitted form containing input values.
   */
  public onSave(form: FormGroup): void {
    this.generatePassword(form.value.url, form.value.key, form.value.salt);
  }

  /**
   * Generates a hashed password based on the input URL, key, and salt.
   * Updates the `genPassword` property and emits the updated password.
   *
   * @param {string} url - The URL entered by the user.
   * @param {string} key - The key entered by the user.
   * @param {string} [salt] - The salt entered by the user (optional).
   * @return {void}
   */
  private generatePassword(url: string, key: string, salt: string = ''): void {
    console.log(this.extractMainDomain(url));
    const mainUrl = this.extractMainDomain(url);
    const combinedString = mainUrl + key + salt;
    this.digestMessage(combinedString).then((updatedPassword) => {
      this.genPassword =
        this.addSplCharAndUpperCase(
            updatedPassword.slice(0, this.passwordLengthFromParent));
      this.passwordUpdated.emit(this.genPassword);
    });
  }

  /**
   * Extracts the main domain from a given URL.
   * If the protocol is missing, it will default to `https://`.
   * @param {string} url - The URL entered by the user.
   * @return {string} The main domain of the URL.
   */
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
   * Creates a SHA-256 hash of the given string.
   * @param {string} message - The input string to hash.
   * @return {Promise<string>} The hexadecimal representation of the hash.
   */
  private async digestMessage(message: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray =
      Array.from(new Uint8Array(hashBuffer)); // Convert buffer to byte array
    // Convert bytes to hex string
    const hashHex =
      hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
  }

  /**
   * Adds a special character and uppercases part of the hash.
   * @param {string} hash - The input hash to modify.
   * @return {string} The modified hash
   * with special characters and uppercase letters.
   */
  private addSplCharAndUpperCase(hash: string): string {
    const {first, last} = this.getFirstOrLastNumber(hash);
    const splChar = this.numberToSpecialChar(last);
    hash = hash.slice(0, first).toUpperCase() + splChar + hash.slice(first);

    return hash;
  }

  /**
   * Finds the first and last numbers in the given string.
   * @param {string} str - The input string to search.
   * @return {FirstLastNumber} An object containing the first and last numbers.
   */
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

  /**
   * Maps a number (0-9) to a corresponding special character.
   * @param {number} num - The number to map.
   * @return {string} The corresponding special character.
   */
  private numberToSpecialChar(num: number): string {
    // Define a mapping of numbers to special characters
    const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

    // Check if the number is between 0-9, otherwise return an empty string
    if (num >= 0 && num <= 9) {
      return specialChars[num];
    } else {
      return '@'; // Default
    }
  }
}
