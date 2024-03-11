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
      key: ''
    });
  }

  public onSave(form: FormGroup) { 
    this.generatePassword(form.value.url, form.value.key);
  }

  private generatePassword(url: string, key: string): void {
    const combinedString = url + key;
    this.digestMessage(combinedString).then((updatedPassword) => {
      this.genPassword = updatedPassword;
      this.passwordUpdated.emit(this.genPassword);
    });
  }

  private async digestMessage(message: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // convert bytes to hex string
    
    return hashHex;
  }
  
}
