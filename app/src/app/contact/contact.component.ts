import { Component, Inject, PLATFORM_ID, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import emailjs from '@emailjs/browser';

declare var grecaptcha: any;

@Component({
  standalone: true,
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./contact.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule]
})
export class ContactComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: Object){
   
  }

  contactForm !: FormGroup;
  displaySuccess = false;

  recaptchaError = false;

  private readonly RECAPTCHA_SITE_KEY = '6LdF8w0tAAAAAHCwbKTwx1h0L22-wnyrbmeY5k1s';
  private readonly EMAILJS_SERVICE_ID = 'service_rwwe5fo';
  private readonly EMAILJS_TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';
  private readonly EMAILJS_PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';
  
  ngOnInit(){
    this.contactForm = new FormGroup({
      firstName: new FormControl('',[Validators.required]),
      lastName: new FormControl('',[]),
      mobile: new FormControl('',[]),
      email: new FormControl('',[Validators.required,customValidator]),
      message: new FormControl('',[Validators.required])
    });
    if (isPlatformBrowser(this.platformId)) {
      this.loadRecaptchaScript();
    }
  }

  private loadRecaptchaScript(): void {
    const scriptId = 'recaptcha-v3-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }

  async onSubmit() {
    // console.log(this.contactForm);
    const isHuman = await this.verifyRecaptcha();
    if (this.contactForm.valid && isHuman) {
      this.displaySuccess = true;
      this.sendEmail();
      this.onReset();
    } else{
      this.contactForm.markAllAsTouched();
      if (!isHuman) {
        this.recaptchaError = true;
        console.error('Security verification failed. Form not submitted.');
      }
    }
  }

  private verifyRecaptcha(): Promise<boolean> {
    return new Promise((resolve) => {
      // Check if the script failed to load (e.g., blocked by adblocker)
      if (typeof grecaptcha === 'undefined') {
        console.error('reCAPTCHA script not loaded properly.');
        resolve(false); 
        return;
      }

      // Execute the security check
      grecaptcha.ready(() => {
        grecaptcha.execute(this.RECAPTCHA_SITE_KEY, { action: 'submit_contact' })
          .then((token: string) => {
            // Human verified!
            resolve(true); 
          })
          .catch((error: any) => {
            // Network error or bot detected
            console.error('reCAPTCHA execution failed:', error);
            resolve(false); 
          });
      });
    });
  }

  sendEmail(){
    const userTemplate = {
      name: this.contactForm.value.firstName + ' ' + this.contactForm.value.lastName,
      email: this.contactForm.value.email, // Maps to {{email}}
    };
    const adminTemplate = {
      firstName: this.contactForm.value.firstName,
      lastName: this.contactForm.value.lastName,
      email: this.contactForm.value.email,
      message: this.contactForm.value.message,
      mobile: this.contactForm.value.mobile
    };
    emailjs.send("service_rwwe5fo", "template_lr19d9g", userTemplate, "7slh2XluDfB5VFJMm")
      .then(() => console.log('Email sent to user successfully!'))
      .catch((err) => console.error(err));
    emailjs.send("service_rwwe5fo", "template_ab4d0yd", adminTemplate, "7slh2XluDfB5VFJMm")
      .then(() => console.log('Email sent to Admin successfully!'))
      .catch((err) => console.error(err));
  }

  onKeyPress(){
    let temp = JSON.parse(JSON.stringify(this.contactForm.controls['mobile'].value))
    // console.log(temp);
    const regex = /[^0-9]/;
    temp = temp.replace(/[^0-9]/g,'')
    this.contactForm.controls['mobile'].patchValue(temp)
  }

  onReset(){
    this.contactForm.reset({
      firstName:'',
      lastName:'',
      mobile:'',
      email:'',
      message:''
    });
    setTimeout(() => {
    this.displaySuccess = false;
    }, 2000);
    this.recaptchaError = false;
    // temp:() => {
    //   console.log(this.displaySuccess);
    // }
    // print:()=>{
    //   this.temp
    // };
  }

}


export function customValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  // If the field is empty, don't throw a regex error (let Validators.required handle that)
  if (!value) {
    return null;
  }

  // Standard email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Notice the "!" - We throw the error if it does NOT match the regex
  if (!emailRegex.test(value)) {
    return { 'emailError': true }; // Renamed from nameError for clarity
  }

  return null;
};


