import {Component, ElementRef, HostListener, ViewChild} from "@angular/core";
import {NavbarService} from "./navbar.service";

export interface NavbarEssential {
  sectionElement: ElementRef,
  navbarElement: ElementRef
}

@Component({
  selector: 'navbar',
  template: `
      <a class="navbar-item" #HomeNavbarItem
         (click)="navigationItemClicked(homeNavbarItem)">Home</a>
      <a class="navbar-item" #OddzialyNavbarItem
         (click)="navigationItemClicked(oddzialyNavbarItem)">Oddziały</a>
      <a class="navbar-item" #PacjenciNavbarItem
         (click)="navigationItemClicked(pacjenciNavbarItem)">Pacjenci</a>
      <a class="navbar-item" #PracownicyNavbarItem
         (click)="navigationItemClicked(pracownicyNavbarItem)">Pracownicy</a>
      <a class="navbar-item" #LekarzeNavbarItem
         (click)="navigationItemClicked(lekarzeNavbarItem)">Lekarze</a>
      <a class="navbar-item" #PersonelNavbarItem
         (click)="navigationItemClicked(personelNavbarItem)">Personel</a>
      <a class="navbar-item" #UrlopyNavbarItem
         (click)="navigationItemClicked(urlopyNavbarItem)">Urlopy</a>
      <a class="navbar-item" #PokojeNavbarItem
         (click)="navigationItemClicked(pokojeNavbarItem)">Pokoje</a>
      <a class="navbar-item" #WizytyNavbarItem
         (click)="navigationItemClicked(wizytyNavbarItem)">Wizyty</a>
      <span class="navbar-slider" [ngStyle]="{'width.px': sliderWidth, 'left.px': sliderLeft}"></span>
  `,
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  @ViewChild('HomeNavbarItem', {read: ElementRef, static: false}) homeNavbarItem: ElementRef;
  @ViewChild('OddzialyNavbarItem', {read: ElementRef, static: false}) oddzialyNavbarItem: ElementRef;
  @ViewChild('PacjenciNavbarItem', {read: ElementRef, static: false}) pacjenciNavbarItem: ElementRef;
  @ViewChild('PracownicyNavbarItem', {read: ElementRef, static: false}) pracownicyNavbarItem: ElementRef;
  @ViewChild('LekarzeNavbarItem', {read: ElementRef, static: false}) lekarzeNavbarItem: ElementRef;
  @ViewChild('PersonelNavbarItem', {read: ElementRef, static: false}) personelNavbarItem: ElementRef;
  @ViewChild('UrlopyNavbarItem', {read: ElementRef, static: false}) urlopyNavbarItem: ElementRef;
  @ViewChild('PokojeNavbarItem', {read: ElementRef, static: false}) pokojeNavbarItem: ElementRef;
  @ViewChild('WizytyNavbarItem', {read: ElementRef, static: false}) wizytyNavbarItem: ElementRef;

  sliderWidth: number = 0;
  sliderLeft: number = 0;

  currentNavbarItem: ElementRef = this.homeNavbarItem;
  navbarEssentials: NavbarEssential[];

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.findCurrentTabSelector();
  }

  @HostListener("window:resize", [])
  onResize() {
    this.setSliderCss();
  }

  constructor(private navbarService: NavbarService) {
    this.navbarService.pageSections.subscribe((pageSections) => {
      this.navbarEssentials = [
        {
          sectionElement: pageSections.home,
          navbarElement: this.homeNavbarItem
        },
        {
          sectionElement: pageSections.oddzialy,
          navbarElement: this.oddzialyNavbarItem
        },
        {
          sectionElement: pageSections.pacjenci,
          navbarElement: this.pacjenciNavbarItem
        },
        {
          sectionElement: pageSections.pracownicy,
          navbarElement: this.pracownicyNavbarItem
        },
        {
          sectionElement: pageSections.lekarze,
          navbarElement: this.lekarzeNavbarItem
        },
        {
          sectionElement: pageSections.personel,
          navbarElement: this.personelNavbarItem
        },
        {
          sectionElement: pageSections.urlopy,
          navbarElement: this.urlopyNavbarItem
        },
        {
          sectionElement: pageSections.pokoje,
          navbarElement: this.pokojeNavbarItem
        },
        {
          sectionElement: pageSections.wizyty,
          navbarElement: this.wizytyNavbarItem
        }
      ];
    });
  }

  navigationItemClicked(currentNavbarItem: ElementRef): void {
    if (this.navbarEssentials) {
      const section =
        this.navbarEssentials
          .find(navbarEssential => navbarEssential.navbarElement === currentNavbarItem).sectionElement;
      section.nativeElement.scrollIntoView({behavior: 'smooth', block: 'center'});
      this.currentNavbarItem = currentNavbarItem;
      this.setSliderCss();
    }
  }

  findCurrentTabSelector() {
    if (this.navbarEssentials) {
      this.navbarEssentials.forEach(element => {
          if (element.sectionElement.nativeElement.offsetTop <= window.pageYOffset
            && element.sectionElement.nativeElement.offsetTop
            + element.sectionElement.nativeElement.offsetHeight >= window.pageYOffset) {
            this.currentNavbarItem = element.navbarElement;
            this.setSliderCss();
          }
        }
      );
    }
  };

  setSliderCss() {
    if (this.currentNavbarItem) {
      this.sliderWidth = this.currentNavbarItem.nativeElement.offsetWidth;
      this.sliderLeft = this.currentNavbarItem.nativeElement.offsetLeft;
    }
  }
}
