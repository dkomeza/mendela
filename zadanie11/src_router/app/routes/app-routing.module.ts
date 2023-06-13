import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClockComponent } from '../components/clock/clock.component';
import { ShowBooksComponent } from '../components/display-books/display-books.component';
import { Service } from '../services/service.service';
import { ChooseBookComponent } from '../components/choose-book/choose-book.component';
import { WpiszZarobkiComponent } from '../components/enter-earnings/enter-earnings.component';
import { ChooseYearsComponent } from '../components/choose-year/choose-year.component';

let czasopisma = [
  'Atari_Age',
  'Komputer',
  'Atari_club',
  'Moje_Atari',
  'Avax',
  'POKE',
  'Bajtek',
  'STEfan',
  'Desktop_Info',
  'Swiat_Atari',
  'IKS',
];
const routes: Routes = [
  { path: '', component: WpiszZarobkiComponent },
  { path: 'books', component: ChooseBookComponent },
  { path: `books/:book`, component: ChooseYearsComponent },
  { path: 'books/:book/:year', component: ShowBooksComponent },
  { path: '**', redirectTo: '/books' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes), CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
