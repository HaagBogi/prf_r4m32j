import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/auth-service';
import { CalendarSchema } from '../shared/calendar-entry.model';
import { CalendarDataService } from '../shared/calendar-service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, OnDestroy {

  private authenticationSub: Subscription;
  isAuthenticated = false;

  constructor(private calendarDataService: CalendarDataService, private router: Router, private authService: AuthService) { }
  
  ngOnDestroy(): void {
    this.calendarEntriesSub.unsubscribe();
    this.authenticationSub.unsubscribe();
  }

  calendarEntries: CalendarSchema[] = [];
  calendarEntriesSub = new Subscription();

  ngOnInit(): void {
    this.calendarDataService.getCalendarEntries();
    this.calendarEntriesSub = this.calendarDataService.calendarSubject.subscribe(entries => {
      this.calendarEntries = entries;
    })
    this.authenticationSub = this.authService.getAuthenticatedSub().subscribe(status => {
      this.isAuthenticated = status;
    })
    this.isAuthenticated = this.authService.getIsAuthenticated();
  }

  onDelete(id: string){
    this.calendarDataService.onDeleteTodo(id);
  }

  onEdit(id: string){
    this.router.navigate(['edit',id])
  }
}
