import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ObservableComponent } from './observable/observable.component';

@NgModule({
  declarations: [
    AppComponent,
    ObservableComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      {
        path: 'observable',
        component: ObservableComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
