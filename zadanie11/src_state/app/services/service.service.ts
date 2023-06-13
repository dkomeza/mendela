import { Injectable } from '@angular/core';
import { parseString } from 'xml2js';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Service {
  chosenBook: string = '';
  chosenYear: string = '';
  lata: string[] = [];
  year: string = '';
  yearChoosed: boolean = false;
  toShow: any = [];
  imgSrc: string[] = [];
  json: any;

  specialNumber = false;
  showEarnings = true;
  showBooks = false;
  showYears = false;
  showBook = false;

  constructor(private http: HttpClient) {}

  imgClick(event: MouseEvent) {
    this.showBooks = false;
    const clickedImg = event.target as HTMLImageElement;
    const index = this.imgSrc.indexOf(clickedImg.src);

    this.chosenBook =
      this.json.czasopisma.zmienne[0][
        Object.keys(this.json.czasopisma.zmienne[0])[index]
      ][0].klik[0];

    this.lata = this.json.czasopisma.lata[0][this.chosenBook][0].split(',');

    this.showBook = true;
  }

  goBack() {
    this.showBook = false;
    this.yearChoosed = false;
    this.toShow = [];
    this.showBooks = true;
  }

  yearClick(event: MouseEvent) {
    this.toShow = [];
    const clickedButton = (event.target as HTMLButtonElement).value;
    const value = clickedButton;
    this.year = value;

    this.yearChoosed = true;
    for (
      let i = 0;
      i < Object.keys(this.json.czasopisma[this.chosenBook][0]).length;
      i++
    ) {
      if (
        !this.json.czasopisma[this.chosenBook][0][
          Object.keys(this.json.czasopisma[this.chosenBook][0])[i]
        ][0]['$']['brak']
      ) {
        if (
          this.json.czasopisma[this.chosenBook][0][
            Object.keys(this.json.czasopisma[this.chosenBook][0])[i]
          ][0]['$']['rok'] == this.year
        ) {
          this.toShow.push(
            this.json.czasopisma[this.chosenBook][0][
              Object.keys(this.json.czasopisma[this.chosenBook][0])[i]
            ][0]
          );
        } else if (this.year == 'all') {
          this.toShow.push(
            this.json.czasopisma[this.chosenBook][0][
              Object.keys(this.json.czasopisma[this.chosenBook][0])[i]
            ][0]
          );
        }
      }
    }
  }

  async getData() {
    await new Promise((resolve) => {
      this.http
        .get('../assets/czasopisma.xml', { responseType: 'text' })
        .subscribe(
          (data) => {
            parseString(data, (err, result) => {
              this.json = result;
              this.imgSrc = [];
              for (
                let i = 0;
                i < Object.keys(result.czasopisma.zmienne[0]).length;
                i++
              ) {
                let x =
                  result.czasopisma.zmienne[0][
                    Object.keys(result.czasopisma.zmienne[0])[i]
                  ][0].src[0];
                this.imgSrc.push(
                  'http://atarionline.pl/biblioteka/czasopisma/img/' + x
                );

                const img = new Image();
                img.src =
                  'http://atarionline.pl/biblioteka/czasopisma/img/' + x;
                console.log(i);
              }
              resolve('');
            });
          },
          (error) => {
            console.log(error);
          }
        );
    });
  }

  getYears(book: string) {
    if (this.json.czasopisma.lata[0][book]) {
      let years = this.json.czasopisma.lata[0][book][0].split(',');
      this.lata = years;
    } else {
      this.lata = [];
    }
  }

  getBooks(book: string, year: string) {
    let books = [];
    for (
      let i = 0;
      i < Object.keys(this.json.czasopisma[book][0]).length;
      i++
    ) {
      if (
        !this.json.czasopisma[book][0][
          Object.keys(this.json.czasopisma[book][0])[i]
        ][0]['$']['brak']
      ) {
        if (
          this.json.czasopisma[book][0][
            Object.keys(this.json.czasopisma[book][0])[i]
          ][0]['$']['rok'] == year
        ) {
          books.push(
            this.json.czasopisma[book][0][
              Object.keys(this.json.czasopisma[book][0])[i]
            ][0]
          );
        } else if (year == 'all') {
          books.push(
            this.json.czasopisma[book][0][
              Object.keys(this.json.czasopisma[book][0])[i]
            ][0]
          );
        }
      }
    }
    this.toShow = books;
  }
}
