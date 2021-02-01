import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LobbyComponent } from './components/lobby/lobby.component';
import { GameComponent } from './components/game/game.component';
import { MaterialModule } from './material/material.module';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { HomeComponent } from './components/home/home.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateUserFormComponent } from './components/home/create-user-form/create-user-form.component';
import { CommonModule } from '@angular/common';
import { RoomListComponent } from './components/lobby/room-list/room-list.component';
import { AppState } from './state/app-state';
import { NgxsModule, Store } from '@ngxs/store';


@NgModule({
  declarations: [
    AppComponent,
    LobbyComponent,
    GameComponent,
    HomeComponent,
    ToolbarComponent,
    CreateUserFormComponent,
    RoomListComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxsModule.forRoot([
      AppState
    ])
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "fill" },
    },
    Store,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
