import {Component, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css'],
})
export class RulesComponent {
  ruleForm: FormGroup;
  passwordLength: number = 16;
  @Output() passwordLengthUpdate = new EventEmitter<number>();

  constructor(private fb:FormBuilder) {
    this.ruleForm = this.buildMasterForm();
  }

  private buildMasterForm() {
    return this.fb.group({
      type: 1,
      passwordLength: 16,
      shouldIncludeNumber: true,
      shouldIncludeSpecialCharacter: true,
    });
  }
  public updateSliderValue(passwordLength: number): void {
    console.log(passwordLength);
    this.passwordLengthUpdate.emit(passwordLength);
  }
}
