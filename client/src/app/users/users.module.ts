import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { UsersRoutingModule } from './users-routing.module';
import { DetailsComponent } from './details/details.component';
import { FormsModule } from '@angular/forms';
import { MenuModule } from '../menu/menu.module';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [UsersComponent, DetailsComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    MenuModule,
    MatTableModule
  ],
  exports: [UsersComponent]
})
export class UsersModule { }
