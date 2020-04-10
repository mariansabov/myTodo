import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateService {
 // public date: BehaviorSubject<moment.Moment> = new BehaviorSubject(moment());
 //  public date() {
 //    return moment();
 //  }
  get date(): moment.Moment {
    return moment();
  }

  constructor() { }
}
