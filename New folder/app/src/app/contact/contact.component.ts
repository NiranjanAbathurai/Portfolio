import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { first } from 'rxjs';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  constructor(private fb:FormBuilder){}

  contactForm !: FormGroup;
  displaySuccess = false;

  ngOnInit(){
    this.contactForm = new FormGroup({
      firstName: new FormControl('',[Validators.required]),
      lastName: new FormControl('',[Validators.required]),
      mobile: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required,customValidator])
    })
  }

  onSubmit(){
    console.log(this.contactForm);
    this.displaySuccess = true;
    setTimeout(()=>{
      this.displaySuccess = false;
    },3000)
  }

  onKeyPress(){
    let temp = JSON.parse(JSON.stringify(this.contactForm.controls['mobile'].value))
    console.log(temp);
    const regex = /[^0-9]/;
    temp = temp.replace(/[^0-9]/g,'')
    this.contactForm.controls['mobile'].patchValue(temp)
  }

  onReset(){
    this.contactForm.reset({
      firstName:'',
      lastName:'',
      mobile:'',
      email:''
    });
    this.displaySuccess = false;
    // temp:() => {
    //   console.log(this.displaySuccess);
    // }
    // print:()=>{
    //   this.temp
    // };
  }

}

export function customValidator(control:AbstractControl): ValidationErrors | null  {
      const forbidden = control.value;
      const regex = /[^a-zA-Z0-9]/;
      if(regex.test(forbidden))
        return { 'nameError':true };

      return null
    } ;


