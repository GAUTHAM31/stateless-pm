import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})

export class InputFormComponent implements OnInit {
  masterInputForm: FormGroup;
  @Input() genPassword: string = 'Password';
  @Output() passwordUpdated = new EventEmitter<string>();
  
  constructor(private fb:FormBuilder) {
    this.masterInputForm = this.buildMasterForm();
  }
  
  ngOnInit(): void {
    // this.buildMasterForm()
  }
  
  private buildMasterForm() {
    return this.fb.group({
      url: '',
      key: '',
      salt: ''
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
      this.genPassword = updatedPassword;
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
      const parts = hostname.split('.').filter(part => part !== 'www');
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
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
    
    return hashHex;
  }
  
}
