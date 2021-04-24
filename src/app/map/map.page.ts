import { Component } from '@angular/core';
import { Exchanger } from '../providers/exchanger';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {

  constructor(public exchanger: Exchanger) { }

}
