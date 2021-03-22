import { Component, Input, OnInit } from '@angular/core';
import { ButtonType } from './round_button.type';

@Component({
  selector: 'app-round-buttom',
  templateUrl: './round-buttom.component.html',
  styleUrls: ['./round-buttom.component.scss'],
})
export class RoundButtomComponent implements OnInit {
  @Input() type: ButtonType | string = ButtonType.stop;
  @Input() color: any = "red";
  @Input() contentColor: any = "white";
  @Input() size: any;

  constructor() { }

  ngOnInit() {}

}
