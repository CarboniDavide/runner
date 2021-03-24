import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';
import { ButtonType } from './round_button.type';

@Component({
  selector: 'app-round-buttom',
  templateUrl: './round-buttom.component.html',
  styleUrls: ['./round-buttom.component.scss'],
})
export class RoundButtomComponent implements OnInit, AfterViewInit {
  @Input() type: ButtonType | string = ButtonType.stop;
  @Input() color: any;
  @Input() contentColor: any;
  @Input() size: any;
  @Input() enableChargeAnimation: boolean = false;
  @Output() fullCircle: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private _element: ElementRef,
    private _domCtrl: DomController,
    private _renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    if (!this.enableChargeAnimation) { return; }
    let el = this._element.nativeElement.querySelector("#button-svg");
    this._renderer.listen(el, "touchstart", this.onTouchstart.bind(this));
    this._renderer.listen(el, "touchend", this.onTouchEnd.bind(this));

    let circleWpr = this._element.nativeElement.querySelector("#circle-wpr");
    this._renderer.setStyle(circleWpr, "transition", "none");
    this._renderer.listen(circleWpr, "transitionend", this.transitionEnd.bind(this));
  }

  ngOnInit() {}

  onTouchEnd(){  
    let circleCcover = this._element.nativeElement.querySelector("#circle-cover");
    let circleCld = this._element.nativeElement.querySelector("#circle-cld");
    this._renderer.setStyle(circleCcover, "r", "50%" );
    this._renderer.setStyle(circleCld, "r", "50%" );

    let circleWpr = this._element.nativeElement.querySelector("#circle-wpr");
    this._renderer.setStyle(circleWpr, "transition", "stroke-dashoffset ease-in-out 0.3s");
    this._renderer.setStyle(circleWpr, "stroke-dashoffset", "360");
  }

  onTouchstart(){
    let circleCcover = this._element.nativeElement.querySelector("#circle-cover");
    let circleCld = this._element.nativeElement.querySelector("#circle-cld");
    this._renderer.setStyle(circleCcover, "r", "39%" );
    this._renderer.setStyle(circleCld, "r", "39%" );

    let circleWpr = this._element.nativeElement.querySelector("#circle-wpr");
    this._renderer.setStyle(circleWpr, "transition", "stroke-dashoffset ease-in-out 3s");
    this._renderer.setStyle(circleWpr, "stroke-dashoffset", "0");
  }

  transitionEnd(){
    let circleWpr = this._element.nativeElement.querySelector("#circle-wpr");
    this.fullCircle.emit(circleWpr.style.strokeDashoffset == 360 ? false : true);
  }

}
