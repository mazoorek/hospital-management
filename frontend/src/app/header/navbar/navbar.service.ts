import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {PageSectionsModel} from "../../../common/PageSections/page-sections.model";

@Injectable({providedIn: "root"})
export class NavbarService {
  pageSections: Subject<PageSectionsModel> = new Subject<PageSectionsModel>();
}
