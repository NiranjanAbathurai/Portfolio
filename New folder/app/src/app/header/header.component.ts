import { Component, HostListener } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  navItems = ['Home','About','Projects','Contact']
  windowWidth !: number;
  isMobile = false;
  dropdownVisible = false;
  event !: Event

  constructor(private router:Router){}

  ngOnInit(){
    this.onResize(this.event);
    this.toggleDropdown(false);
  }

  @HostListener('window:resize',['$event'])
  onResize(event:Event){
    this.windowWidth = window.innerWidth;
    console.log('Window resized, new width:', this.windowWidth);
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
    console.log(item);
    this.dropdownVisible = false;
    this.router.navigateByUrl(item.toLowerCase())
  }
}
