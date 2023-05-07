import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CalendarSchema } from '../shared/calendar-entry.model';
import { CalendarDataService } from '../shared/calendar-service';

@Component({
  selector: 'app-calendar-form',
  templateUrl: './calendar-form.component.html',
  styleUrls: ['./calendar-form.component.css']
})
export class CalendarFormComponent implements OnInit {

  editMode = false;
  private paramId: string;
  CalendarSchema: CalendarSchema;

  calendarForm : FormGroup;
  
  
  constructor(private calendarDataService: CalendarDataService, private router: Router, private activatedRoute: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('id')){
        this.editMode = true;
        this.paramId = paramMap.get('id')!;
        this.CalendarSchema = this.calendarDataService.getCalendarSchema(this.paramId);
      }
      else{
        this.editMode = false;
      }
    })
    this.calendarForm = new FormGroup({
      'date': new FormControl(this.editMode ? this.CalendarSchema.date : '', [Validators.required]),
      'todo': new FormControl(this.editMode ? this.CalendarSchema.todo : '', [Validators.required])
    })
    
  }

  onSubmit(){
    const user = localStorage.getItem('user');
    if (!user) return;
    const todo = new CalendarSchema('', this.calendarForm.value.date, this.calendarForm.value.todo, user);
    if(this.editMode){
      todo.id = this.paramId;
      this.calendarDataService.updateTodo(this.paramId, todo);
    }
    else{
      this.calendarDataService.onAddCalendarSchema(todo);
    }
    this.router.navigateByUrl("");
  }
}
