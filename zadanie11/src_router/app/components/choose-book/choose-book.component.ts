import { Component } from '@angular/core';
import { Service } from '../../services/service.service';

@Component({
  selector: 'app-choose-book',
  templateUrl: './choose-book.component.html',
  styleUrls: ['./choose-book.component.scss'],
})
export class ChooseBookComponent {
  constructor(public service: Service) {}
}
