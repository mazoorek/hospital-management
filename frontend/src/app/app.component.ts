import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

export interface PageSection {
  sectionElement: ElementRef,
  navbarElement: ElementRef
}

@Component({
  selector: 'app-root',
  template: `
      <div class="header-section" #header>
          <h1 class="title">HOSPITAL MANAGEMENT</h1>
          <h3 class="subtitle">Aplikacja do zarządzania szpitalem</h3>
          <div class="navbar-container" [ngClass]="{'fixed': fixed}">
              <a class="navbar-item" #HomeNavbarItem
                 (click)="navigationItemClicked(home, homeNavbarItem)">Home</a>
              <a class="navbar-item" #OddzialyNavbarItem
                 (click)="navigationItemClicked(oddzialy, oddzialyNavbarItem)">Oddziały</a>
              <a class="navbar-item" #PacjenciNavbarItem
                 (click)="navigationItemClicked(pacjenci, pacjenciNavbarItem)">Pacjenci</a>
              <a class="navbar-item" #PracownicyNavbarItem
                 (click)="navigationItemClicked(pracownicy, pracownicyNavbarItem)">Pracownicy</a>
              <a class="navbar-item" #LekarzeNavbarItem
                 (click)="navigationItemClicked(lekarze, lekarzeNavbarItem)">Lekarze</a>
              <a class="navbar-item" #PersonelNavbarItem
                 (click)="navigationItemClicked(personel, personelNavbarItem)">Personel</a>
              <a class="navbar-item" #UrlopyNavbarItem
                 (click)="navigationItemClicked(urlopy, urlopyNavbarItem)">Urlopy</a>
              <a class="navbar-item" #PokojeNavbarItem
                 (click)="navigationItemClicked(pokoje, pokojeNavbarItem)">Pokoje</a>
              <span class="navbar-slider" [ngStyle]="{'width.px': sliderWidth, 'left.px': sliderLeft}"></span>
          </div>
      </div>

      <div class="section" #Oddzialy>
          <h1>Oddziały</h1>
      </div>
      <div class="section" #Pacjenci>
          <h1>Pacjenci</h1>
      </div>
      <div class="section" #Pracownicy>
          <h1>Pracownicy</h1>
      </div>
      <div class="section" #Lekarze>
          <h1>Lekarze</h1>
      </div>
      <div class="section" #Personel>
          <h1>Personel</h1>
      </div>
      <div class="section" #Urlopy>
          <h1>Urlopy</h1>
      </div>
      <div class="section" #Pokoje>
          <h1>Pokoje</h1>
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

  @ViewChild('HomeNavbarItem', {read: ElementRef, static: false}) homeNavbarItem: ElementRef;
  @ViewChild('OddzialyNavbarItem', {read: ElementRef, static: false}) oddzialyNavbarItem: ElementRef;
  @ViewChild('PacjenciNavbarItem', {read: ElementRef, static: false}) pacjenciNavbarItem: ElementRef;
  @ViewChild('PracownicyNavbarItem', {read: ElementRef, static: false}) pracownicyNavbarItem: ElementRef;
  @ViewChild('LekarzeNavbarItem', {read: ElementRef, static: false}) lekarzeNavbarItem: ElementRef;
  @ViewChild('PersonelNavbarItem', {read: ElementRef, static: false}) personelNavbarItem: ElementRef;
  @ViewChild('UrlopyNavbarItem', {read: ElementRef, static: false}) urlopyNavbarItem: ElementRef;
  @ViewChild('PokojeNavbarItem', {read: ElementRef, static: false}) pokojeNavbarItem: ElementRef;

  currentTab: ElementRef = this.homeNavbarItem;
  tabContainerHeight: number = 70;
  fixed: boolean = false;
  sliderWidth: number = 0;
  sliderLeft: number = 0;
  pageSections: PageSection[];

  ngAfterViewInit(): void {
    this.pageSections = [
      {
        sectionElement: this.home,
        navbarElement: this.homeNavbarItem
      },
      {
        sectionElement: this.oddzialy,
        navbarElement: this.oddzialyNavbarItem
      },
      {
        sectionElement: this.pacjenci,
        navbarElement: this.pacjenciNavbarItem
      },
      {
        sectionElement: this.pracownicy,
        navbarElement: this.pracownicyNavbarItem
      },
      {
        sectionElement: this.lekarze,
        navbarElement: this.lekarzeNavbarItem
      },
      {
        sectionElement: this.personel,
        navbarElement: this.personelNavbarItem
      },
      {
        sectionElement: this.urlopy,
        navbarElement: this.urlopyNavbarItem
      },
      {
        sectionElement: this.pokoje,
        navbarElement: this.pokojeNavbarItem
      },
    ];
  }


  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.checkTabContainerPosition();
    this.findCurrentTabSelector();
  }

  @HostListener("window:resize", [])
  onResize() {
    this.setSliderCss();
  }

  checkTabContainerPosition() {
    let offset =
      this.home.nativeElement.offsetTop + this.home.nativeElement.offsetHeight - this.tabContainerHeight;
    this.fixed = window.pageYOffset > offset;
  }


  navigationItemClicked(section: ElementRef, currentTab: ElementRef) {
    section.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
    this.currentTab = currentTab;
    this.setSliderCss();
  }

  findCurrentTabSelector() {
    this.pageSections.forEach(element => {
      if (element.sectionElement.nativeElement.offsetTop <= window.pageYOffset
        && element.sectionElement.nativeElement.offsetTop
        + element.sectionElement.nativeElement.offsetHeight >= window.pageYOffset) {
        this.currentTab = element.navbarElement;
        this.setSliderCss();
      }
    });
  };

  setSliderCss() {
    if (this.currentTab) {
      this.sliderWidth = this.currentTab.nativeElement.offsetWidth;
      this.sliderLeft = this.currentTab.nativeElement.offsetLeft;
    }
  }
}
