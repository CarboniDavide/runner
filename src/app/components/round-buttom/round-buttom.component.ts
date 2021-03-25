import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';
import { ButtonType } from './round_button.type';

@Component({
  selector: 'app-round-buttom',
  templateUrl: './round-buttom.component.html',
  styleUrls: ['./round-buttom.component.scss'],
})
export class RoundButtomComponent implements AfterViewInit {
  readonly DISABLED: boolean = false;
  readonly FILL_DURATION: number = 3;
  readonly RESTORE_DURATION: number = 10;
  readonly FILL_ANIMATION: string = "ease-out";
  readonly RESTORE_ANIMATION: string = "ease-in-out";
  readonly START_AT: number = 0;
  readonly END_AT: number = 360;
  readonly REDUCE_RADIUS: number = 39;
  readonly RADIUS_ANIMATION_DURATION: number = 0.3;
  readonly RADIUS_ANIMATION: string = "ease-in-out";
  readonly TYPE: ButtonType = ButtonType.stop;
  readonly COLOR: any = "Black"
  readonly CONTENT_COLOR: any ="white";
  readonly DISABLED_COLOR: any = "lightgray";
  readonly SIZE: any = 70;
  readonly ENABLE_CHARGE_ANIMATION: boolean = false;
  readonly CONTENT_SVG: any = null;

  @Input() disabled: boolean = this.DISABLED;
  @Input() fillDuration: number = this.FILL_DURATION;
  @Input() restoreDuration: number = this.RESTORE_DURATION;
  @Input() fillAnimation: string = this.FILL_ANIMATION;
  @Input() restoreAnimation: string = this. RESTORE_ANIMATION;
  @Input() startAt: number = this.START_AT;
  @Input() endAt: number = this.END_AT;
  @Input() reduceRadius: number = this.REDUCE_RADIUS;
  @Input() radiusAnimationDuration: number = this.RADIUS_ANIMATION_DURATION;
  @Input() radiusAnimation: string = this.RADIUS_ANIMATION;
  @Input() type: ButtonType | string = this.TYPE;
  @Input() color: any = this.COLOR;
  @Input() contentColor: any = this.CONTENT_COLOR;
  @Input() disabledColor: any = this.DISABLED_COLOR;
  @Input() size: any = this.SIZE;
  @Input() enableChargeAnimation: boolean = this.ENABLE_CHARGE_ANIMATION;
  @Input() contentSVG: any = this.CONTENT_SVG;
  @Output() onChargeComplete: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _stroke: any;
  private _cover: any;
  private _content: any;

  private _isContentRestoring = false;
  private _isStrokeRestoring = false;

  constructor(
    private _element: ElementRef,
    private _domCtrl: DomController,
    private _renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    
    if (!this._checkInputValues()) { return; }

    this._cover = this._element.nativeElement.querySelector("#circle-cover");
    this._content = this._element.nativeElement.querySelector("#circle-content");
    this._stroke = this._element.nativeElement.querySelector("#circle-stroke");

    this._renderer.listen(this._element.nativeElement, "touchstart", this._onTouchstart.bind(this));
    this._renderer.listen(this._element.nativeElement, "touchend", this._onTouchEnd.bind(this));

    this._renderer.setStyle(this._stroke, "transition", "none");
    this._renderer.setStyle(this._stroke, "stroke-dashoffset", (360 - this.startAt));

    this._renderer.setStyle(this._content, "transition", this.radiusAnimation + " " + this.radiusAnimationDuration + "s");
    this._renderer.setStyle(this._cover, "transition", this.radiusAnimation + " " + this.radiusAnimationDuration + "s");

    this._renderer.listen(this._stroke, "transitionend", this._strokeTransitionEnd.bind(this));
    this._renderer.listen(this._content, "transitionend", this._contentTransitionEnd.bind(this));
  }

  private _checkInputValues(): boolean{
    this.endAt = this.endAt > 360 ? this.END_AT : this.endAt;
    this.startAt = this.startAt > 360 ? this.START_AT : this.startAt;
    this.restoreDuration = this.restoreDuration <= 0 ? this.RESTORE_DURATION : this.restoreDuration;
    this.enableChargeAnimation = this.enableChargeAnimation && !this.disabled;
    this.enableChargeAnimation = this.enableChargeAnimation && (this.startAt != this.endAt);
    this.enableChargeAnimation = this.enableChargeAnimation && (this.fillDuration > 0);
    this.enableChargeAnimation = this.enableChargeAnimation && (this.reduceRadius < 50);
    this.enableChargeAnimation = this.enableChargeAnimation && (this.radiusAnimationDuration > 0);
    if (this.contentSVG != null){ this._element.nativeElement.querySelector("g").innerHTML = this.contentSVG; }
    return this.enableChargeAnimation;
  }

  private _restoreContent(){
    this._isContentRestoring = true;
    this._domCtrl.write(()=> {
      this._renderer.setStyle(this._cover, "r", "50%" );
      this._renderer.setStyle(this._content, "r", "50%" );
    });
  }

  private _reduceContent(){
    this._isContentRestoring = false;
    this._domCtrl.write(()=> {
      this._renderer.setStyle(this._cover, "r", this.reduceRadius + "%" );
      this._renderer.setStyle(this._content, "r", this.reduceRadius + "%" );
    });
  }

  private _restoreStroke(){
    this._isStrokeRestoring = true;
    this._domCtrl.write(()=> {
      this._renderer.setStyle(this._stroke, "transition", "stroke-dashoffset " + this.restoreAnimation + " " + this.restoreDuration + "s");
      this._renderer.setStyle(this._stroke, "stroke-dashoffset", (360 - this.startAt).toString() );
   });
  }

  private _increaseStroke(){
    if (this._isContentRestoring) { return; }
    this._isStrokeRestoring = false;
    this._domCtrl.write(()=> {
      this._renderer.setStyle(this._stroke, "transition", "stroke-dashoffset " + this.fillAnimation + " " + this.fillDuration + "s");
      this._renderer.setStyle(this._stroke, "stroke-dashoffset", (360 - this.endAt).toString() );
    });
  }

  private _onTouchEnd(){  
   this._restoreStroke();
  }

  private _onTouchstart(){
    this._reduceContent();
  }

  private _strokeTransitionEnd(){
    this._restoreContent();
    this.onChargeComplete.emit(this._stroke.style.strokeDashoffset == (360 - this.endAt) ? true : false);
  }

  private _contentTransitionEnd(){
    this._increaseStroke();
  }
}
