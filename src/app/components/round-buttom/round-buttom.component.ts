import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonType } from './round_button.type';

@Component({
  selector: 'app-round-buttom',
  templateUrl: './round-buttom.component.html',
  styleUrls: ['./round-buttom.component.scss'],
})
export class RoundButtomComponent implements AfterViewInit, OnInit {

  @Input() disabledColor: any = "lightgray"
  @Input() disabled: boolean = false;
  @Input() type: ButtonType | string =  ButtonType.stop;
  @Input() color: any = "black"
  @Input() iconColor: any = "white"
  @Input() strokeColor: any = this.color;
  @Input() size: any = "100%";
  @Input() enableChargeAnimation: boolean = false;
  @Output() onChargeComplete: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  _onChargeComplete(){
    this.onChargeComplete.emit(true);
  }
}