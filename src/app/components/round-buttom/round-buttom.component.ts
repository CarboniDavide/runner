import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';
import { ButtonType } from './round_button.type';

@Component({
  selector: 'app-round-buttom',
  templateUrl: './round-buttom.component.html',
  styleUrls: ['./round-buttom.component.scss'],
})
export class RoundButtomComponent implements AfterViewInit {
  readonly FILL_DURATION: number = 3;
  readonly RESTORE_DURATION: number = 0.3;
  readonly FILL_ANIMATION: string = "ease-in-out";
  readonly RESTORE_ANIMATION: string = "ease-in-out";
  readonly START_AT: number = 0;
  readonly END_AT: number = 360;
  readonly REDUCE_RADIUS: number = 39;
  readonly TYPE: ButtonType = ButtonType.stop;
  readonly COLOR: any = "Black"
  readonly CONTENT_COLOR: any ="white";
  readonly SIZE: any = 70;
  readonly ENABLE_CHARGE_ANIMATION: boolean = false;

  @Input() fillDuration: number = this.FILL_DURATION;
  @Input() restoreDuration: number = this.RESTORE_DURATION;
  @Input() fillAnimation: string = this.FILL_ANIMATION;
  @Input() restoreAnimation: string = this. RESTORE_ANIMATION;
  @Input() startAt: number = this.START_AT;
  @Input() endAt: number = this.END_AT;
  @Input() reduceRadius: number = this.REDUCE_RADIUS;
  @Input() type: ButtonType | string = this.TYPE;
  @Input() color: any = this.COLOR;
  @Input() contentColor: any = this.CONTENT_COLOR;
  @Input() size: any = this.SIZE;
  @Input() enableChargeAnimation: boolean = this.ENABLE_CHARGE_ANIMATION;
  @Output() onChargeComplete: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _circleWpr: any;
  private _circleCcover: any;
  private _circleCld: any;

  constructor(
    private _element: ElementRef,
    private _domCtrl: DomController,
    private _renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    this._checkInputValues();

    if (!this.enableChargeAnimation) { return; }

    this._circleCcover = this._element.nativeElement.querySelector("#circle-cover");
    this._circleCld = this._element.nativeElement.querySelector("#circle-cld");
    this._circleWpr = this._element.nativeElement.querySelector("#circle-wpr");

    this._renderer.listen(this._element.nativeElement, "touchstart", this.onTouchstart.bind(this));
    this._renderer.listen(this._element.nativeElement, "touchend", this.onTouchEnd.bind(this));
    this._renderer.setStyle(this._circleWpr, "transition", "none");
    this._renderer.setStyle(this._circleWpr, "stroke-dashoffset", this._getRadius(this.startAt));
    this._renderer.setStyle(this._circleCld, "transition", "ease-in-out 0.3s");
    this._renderer.setStyle(this._circleCcover, "transition", "ease-in-out 0.3s");
    this._renderer.listen(this._circleWpr, "transitionend", this.transitionEnd.bind(this));
  }

  private _checkInputValues(){
    this.endAt = this.endAt > 360 ? this.END_AT : this.endAt;
    this.startAt = this.startAt > 360 ? this.START_AT : this.startAt;
    this.restoreDuration = this.restoreDuration <= 0 ? this.RESTORE_DURATION : this.restoreDuration;

    this.enableChargeAnimation = this.enableChargeAnimation && (this.startAt != this.endAt);
    this.enableChargeAnimation = this.enableChargeAnimation && (this.fillDuration > 0);
    this.enableChargeAnimation = this.enableChargeAnimation && (this.reduceRadius < 50);
  }

  private _getRadius(value:number) {
    return 360 - value;
  }

  onTouchEnd(){  
    this._domCtrl.write(()=> {
      this._renderer.setStyle(this._circleCcover, "r", "50%" );
      this._renderer.setStyle(this._circleCld, "r", "50%" );
      this._renderer.setStyle(this._circleWpr, "transition", "stroke-dashoffset " + this.restoreAnimation + " " + this.restoreDuration + "s");
      this._renderer.setStyle(this._circleWpr, "stroke-dashoffset", this._getRadius(this.startAt).toString() );
    });
  }

  onTouchstart(){
    this._domCtrl.write(()=> {
      this._renderer.setStyle(this._circleCcover, "r", this.reduceRadius + "%" );
      this._renderer.setStyle(this._circleCld, "r", this.reduceRadius + "%" );
      this._renderer.setStyle(this._circleWpr, "transition", "stroke-dashoffset " + this.fillAnimation + " " + this.fillDuration + "s");
      this._renderer.setStyle(this._circleWpr, "stroke-dashoffset", this._getRadius(this.endAt).toString() );
    });
  }

  transitionEnd(){
    this.onChargeComplete.emit(this._circleWpr.style.strokeDashoffset == this._getRadius(this.endAt) ? true : false);
  }

}
