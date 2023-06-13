import { Component } from '@angular/core';
import { Service } from '../../services/service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-choose-year',
  templateUrl: './choose-year.component.html',
  styleUrls: ['./choose-year.component.scss'],
})
export class ChooseYearsComponent {
  constructor(public service: Service, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.service.getData().then(() => {
      this.service.chosenBook = this.route.snapshot.params['book'];
      this.service.getYears(this.route.snapshot.params['book']);
      if (this.service.lata.length == 0) {
        this.service.goBack();
      }
    });
  }
}
