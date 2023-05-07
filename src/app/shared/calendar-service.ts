import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Subject } from "rxjs";
import { CalendarSchema } from "./calendar-entry.model";

@Injectable({providedIn:"root"})
export class CalendarDataService{

    public maxId: number;

    constructor(private http: HttpClient){}

    updateTodo(id: string, entry: CalendarSchema) {
      this.http.put<{message: string}>('http://localhost:3000/update-todo/' + id, entry).subscribe((jsonData) => {
        console.log(jsonData.message);
        this.getCalendarEntries();
      })
    }
    
    public calendarSubject = new Subject<CalendarSchema[]>();
    private calendarEntries: CalendarSchema[] = [];

    onDeleteTodo(id: string){
        this.http.delete<{message: string}>('http://localhost:3000/remove-todo/' + id).subscribe((jsonData) => {
        console.log(jsonData.message);
        this.getCalendarEntries();
        })
    }

    getCalendarEntries(){
        const user = localStorage.getItem('user')
        this.http.get<{calendarEntries: any}>('http://localhost:3000/calendar-entries')
        .pipe(map((responseData) => {
            return responseData.calendarEntries.filter((entry:{date: Date; todo: string; user: string; _id: string}) => entry.user=== user).map((entry: {date: Date; todo: string; user: string; _id: string}) => {
                return {
                    date: entry.date,
                    todo: entry.todo,
                    user: entry.user,
                    id: entry._id
                }
            })
        }))
        .subscribe((updateResponse) => {
            this.calendarEntries = updateResponse;
            this.calendarSubject.next(this.calendarEntries);
        })
    }

    getCalendarSchema(id: string){
        const index = this.calendarEntries.findIndex(el => {
            return el.id == id;
        })
        return this.calendarEntries[index];
    }

    onAddCalendarSchema(calendarEntry: CalendarSchema){
     this.http.post<{message: string}>('http://localhost:3000/add-todo', calendarEntry).subscribe((jsonData) => {
                console.log(calendarEntry);
                this.getCalendarEntries();
            })
    }
}