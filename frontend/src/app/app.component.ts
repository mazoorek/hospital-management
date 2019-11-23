import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {NavbarService} from "./header/navbar/navbar.service";

const TAB_CONTAINER_HEIGHT: number = 70;

@Component({
  selector: 'app-root',
  template: `
      <header #header [fixed]="fixed"></header>
      <hospital-wards #Oddzialy></hospital-wards>
      <patients #Pacjenci></patients>
      <employees #Pracownicy></employees>
      <doctors  #Lekarze>></doctors>
      <div class="section" #Personel>
          <h1>Personel</h1>
      </div>
      <div class="section" #Urlopy>
          <h1>Urlopy</h1>
      </div>
      <div class="section" #Pokoje>
          <h1>Pokoje</h1>
      </div>
      <div class="section" #Wizyty>
          <h1>Wizyty</h1>
      </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('header', {read: ElementRef, static: false}) home: ElementRef;
  @ViewChild('Oddzialy', {read: ElementRef, static: false}) oddzialy: ElementRef;
  @ViewChild('Pacjenci', {read: ElementRef, static: false}) pacjenci: ElementRef;
  @ViewChild('Pracownicy', {read: ElementRef, static: false}) pracownicy: ElementRef;
  @ViewChild('Lekarze', {read: ElementRef, static: false}) lekarze: ElementRef;
  @ViewChild('Personel', {read: ElementRef, static: false}) personel: ElementRef;
  @ViewChild('Urlopy', {read: ElementRef, static: false}) urlopy: ElementRef;
  @ViewChild('Pokoje', {read: ElementRef, static: false}) pokoje: ElementRef;
  @ViewChild('Wizyty', {read: ElementRef, static: false}) wizyty: ElementRef;

  fixed: boolean = false;

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.checkTabContainerPosition();
  }

  constructor(private navbarService: NavbarService) {
  }

  ngAfterViewInit(): void {
    this.navbarService.pageSections.next({
      home: this.home,
      oddzialy: this.oddzialy,
      pacjenci: this.pacjenci,
      pracownicy: this.pracownicy,
      lekarze: this.lekarze,
      personel: this.personel,
      urlopy: this.urlopy,
      pokoje: this.pokoje,
      wizyty: this.wizyty
    });
  }

  checkTabContainerPosition(): void {
    let offset =
      this.home.nativeElement.offsetTop + this.home.nativeElement.offsetHeight - TAB_CONTAINER_HEIGHT;
    this.fixed = window.pageYOffset > offset;
  }
}
