import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ClockComponent } from './components/clock/clock.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './routes/app-routing.module';
import { ShowBooksComponent } from './components/display-books/display-books.component';
import { ChooseBookComponent } from './components/choose-book/choose-book.component';
import { WpiszZarobkiComponent } from './components/enter-earnings/enter-earnings.component';
import { ChooseYearsComponent } from './components/choose-year/choose-year.component';

@NgModule({
  declarations: [
    AppComponent,
    ClockComponent,
    ShowBooksComponent,
    ChooseBookComponent,
    WpiszZarobkiComponent,
    ChooseYearsComponent,
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
