import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../model/User';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  @Input() user?: User;
  @Output() userEmitter: EventEmitter<User> = new EventEmitter<User>();

  constructor() { }

  ngOnInit(): void {
  }

  sendBackResult() {
    this.userEmitter?.emit(this.user);
  }

}
