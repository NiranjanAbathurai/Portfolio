import { Component, ElementRef, HostListener, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CommonService } from '../service/common.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  navItems = ['Home','Skills','Projects','Contact']
  windowWidth !: number;
  isMobile = false;
  dropdownVisible = false;
  event !: Event

  constructor(private router:Router, private commonService: CommonService,private translateService: TranslateService){}

 languages = [
    { value: 'en', label: 'English' },
    { value: 'ta', label: 'Tamil' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
    { value: 'hi', label: 'Hindi' }
  ];

  currentLang: string = 'en';

  onLanguageChange(newLang: string) {
    this.currentLang = newLang || 'en';
    this.translateService.use(this.currentLang);
    localStorage.setItem('selectedLang', this.currentLang);
  }

  ngOnInit(){
    this.onResize(this.event);
    this.toggleDropdown(false);
  }

  @HostListener('window:resize',['$event'])
  onResize(event:Event){
    this.windowWidth = window.innerWidth;
    // console.log('Window resized, new width:', this.windowWidth);
    if (this.windowWidth <= 768) {
     this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  toggleDropdown(value:boolean){
    this.dropdownVisible = value;
  }

  onClickItem(item:string){
    // console.log(item);
    this.dropdownVisible = false;
    // this.router.navigateByUrl(item.toLowerCase());
    this.commonService.scrollToTarget.next(item.toLowerCase()+'ViewChild');
  }
}
