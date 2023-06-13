import { Component, OnInit } from '@angular/core';
import { Service } from '../../services/service.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-books',
  templateUrl: './display-books.component.html',
  styleUrls: ['./display-books.component.scss'],
})
export class ShowBooksComponent implements OnInit {
  constructor(public service: Service) {}

  ngOnInit(): void {
    this.service.getData().then(() => {
      this.service.getYears(this.service.chosenBook);
      this.service.getBooks(this.service.chosenBook, this.service.chosenYear);
      if (this.service.toShow.length == 0) {
        this.service.showBooks = false;
      }
    });
  }
}
