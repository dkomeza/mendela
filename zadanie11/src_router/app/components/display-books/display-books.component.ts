import { Component, OnInit } from '@angular/core';
import { Service } from '../../services/service.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-show-books',
  templateUrl: './display-books.component.html',
  styleUrls: ['./display-books.component.scss'],
})
export class ShowBooksComponent implements OnInit {
  constructor(
    public service: Service,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.params);
    this.service.getData().then(() => {
      this.service.chosenBook = this.route.snapshot.params['book'];
      this.service.getYears(this.route.snapshot.params['book']);
      this.service.getBooks(
        this.route.snapshot.params['book'],
        this.route.snapshot.params['year']
      );
      console.log(this.service.toShow);
      if (this.service.toShow.length == 0) {
        this.router.navigate(['/choose-book']);
      }
    });
  }
}
