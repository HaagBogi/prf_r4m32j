import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarFormComponent } from './calendar-form/calendar-form.component';
import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './login/login.component';
import { RouteGuard } from './shared/route-guard';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {path: '', component:CalendarComponent},
  {path:'data-todo',component: CalendarFormComponent, canActivate:[RouteGuard]},
  {path:'edit/:id', component: CalendarFormComponent, canActivate:[RouteGuard]},
  {path:'login', component:LoginComponent},
  {path:'sign-up', component:SignUpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [RouteGuard]
})
export class AppRoutingModule { }
