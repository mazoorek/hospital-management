import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {PageSections} from "../../../common/PageSections/PageSections";

@Injectable({providedIn: "root"})
export class NavbarService {
  pageSections: Subject<PageSections> = new Subject<PageSections>();
}
