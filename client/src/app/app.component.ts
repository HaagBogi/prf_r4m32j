import { Component } from '@angular/core';

// Decorators
@Component({
  selector: 'app-root', // HTML tag
  // template: '<h1>HELLO!</h1>',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-project';

  myObject: any = {};

  constructor() {
    // tslint:disable-next-line:no-string-literal
    this.myObject['title'] = this.title;
  }
}
