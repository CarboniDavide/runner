import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';
import { ButtonType } from './round_button.type';

@Component({
  selector: 'app-round-buttom',
  templateUrl: './round-buttom.component.html',
  styleUrls: ['./round-buttom.component.scss'],
})
export class RoundButtomComponent implements AfterViewInit {

  readonly USE_SHADOW: boolean = true;                               // use shadow css style          
  readonly REVERSE_ANIM: boolean = false;                             // reverese animation after stroke bar is charge is complete    
  readonly DISABLED: boolean = false;                                 // disable button
  readonly START_AT: number = 0;                                      // start stroke point animation in deg  
  readonly END_AT: number = 360;                                      // stop stroke point animation in deg
  readonly REDUCE_RADIUS: number = 11;                                // reduced radius for animation in % (1..50)
  readonly RADIUS_ANIMATION_DURATION: number = 0.3;                   // reduce circle animationduration in seconds
  readonly RADIUS_ANIMATION: string = "ease-in-out";                  // reduce circle animation type
  readonly TYPE: ButtonType = ButtonType.stop;                        // icon type
  readonly COLOR: any = "black"                                       // circle color
  readonly CONTENT_COLOR: any ="white";                               // icon color
  readonly DISABLED_COLOR: any = "lightgray";                         // circle color disabled      
  readonly SIZE: any = "100%";                                        // size of circle
  readonly STROKE_PP_SIZE: number = 8;                                // stroke size in % (1..50)
  readonly STROKE_PP_RADIUS: number = 46;                             // stroke radius in % (1..50)
  readonly STROKE_COLOR: any = this.COLOR;                            // stroke color 
  readonly STROKE_FILL_DURATION: number = 3;                          // stroke increase animation duration in seconds    
  readonly STROKE_RESTORE_DURATION: number = 0.3;                     // stroke decrease animation duration in seconds  
  readonly STROKE_FILL_ANIMATION: string = "ease-out";                // stroke increase animation type
  readonly STROKE_RESTORE_ANIMATION: string = "ease-in-out";          // stroke decrease animation type
  readonly ENABLE_CHARGE_ANIMATION: boolean = false;                  // anable stroke animation
  readonly CONTENT_SVG: any = null;  
  
  @Input() reverseAnim: boolean = this.REVERSE_ANIM;
  @Input() useShadow: boolean = this.USE_SHADOW;
  @Input() disabled: boolean = this.DISABLED;
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
  @Input() strokeSize: number = this.STROKE_PP_SIZE;
  @Input() strokeRadius: number = this.STROKE_PP_RADIUS;
  @Input() strokeColor: any = this.STROKE_COLOR;
  @Input() strokeFillDuration: number = this.STROKE_FILL_DURATION;
  @Input() strokeRestoreDuration: number = this.STROKE_RESTORE_DURATION;
  @Input() strokeFillAnimation: string = this.STROKE_FILL_ANIMATION;
  @Input() strokeRestoreAnimation: string = this.STROKE_RESTORE_ANIMATION;
  @Input() enableChargeAnimation: boolean = this.ENABLE_CHARGE_ANIMATION;
  @Input() contentSVG: any = this.CONTENT_SVG;
  @Output() onChargeComplete: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _stroke: any;
  private _cover: any;
  private _content: any;

  private _isContentRestoring?: boolean = null;
  private _isStrokeRestoring?: boolean = null;
  private _strokeChargeComplete: boolean = false;

  contentRadius: number = 50;

  constructor(
    private _element: ElementRef,
    private _domCtrl: DomController,
    private _renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {

    this._cover = this._element.nativeElement.querySelector("#circle-cover");
    this._content = this._element.nativeElement.querySelector("#circle-content");
    this._stroke = this._element.nativeElement.querySelector("#circle-stroke");

    // shadow
    /*
    this.strokeRadius = this.useShadow ? this.strokeRadius - 1 : this.strokeRadius;
    this.contentRadius = this.useShadow ? this.contentRadius -1 : this.contentRadius;
    this._renderer.addClass(this._content, this.useShadow ? "circle-shadow" : "");
    this._renderer.addClass(this._stroke, this.useShadow ? "circle-shadow" : "");
    */

    if (!this._checkInputValues()) { return; }

    this._renderer.listen(this._element.nativeElement, "touchstart", this._startAnimation.bind(this));
    this._renderer.listen(this._element.nativeElement, "touchend", this._stopAnimation.bind(this));

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
    this.strokeRestoreDuration = this.strokeRestoreDuration <= 0 ? this.STROKE_RESTORE_DURATION : this.strokeRestoreDuration;
    this.reduceRadius = (50 - this.reduceRadius);      
    this.enableChargeAnimation = this.enableChargeAnimation && !this.disabled;
    this.enableChargeAnimation = this.enableChargeAnimation && (this.startAt != this.endAt);
    this.enableChargeAnimation = this.enableChargeAnimation && (this.strokeFillDuration > 0);
    this.enableChargeAnimation = this.enableChargeAnimation && (this.reduceRadius < 50);
    this.enableChargeAnimation = this.enableChargeAnimation && (this.radiusAnimationDuration > 0);
    if (this.contentSVG != null){ this._element.nativeElement.querySelector("#custom-button").innerHTML = this.contentSVG; }
    return this.enableChargeAnimation;
  }

  private _restoreContent(){
    this._isContentRestoring = true;
    this._isStrokeRestoring = null;
    this._domCtrl.write(()=> {
      this._renderer.setStyle(this._cover, "r", this.contentRadius + "%" );
      this._renderer.setStyle(this._content, "r", this.contentRadius + "%" );
    });
  }

  private _reduceContent(){
    this._isContentRestoring = false;
    this._isStrokeRestoring = null;
    this._domCtrl.write(()=> {
      this._renderer.setStyle(this._cover, "r", this.reduceRadius + "%" );
      this._renderer.setStyle(this._content, "r", this.reduceRadius + "%" );
    });
  }

  private _restoreStroke(){
    this._isStrokeRestoring = true;
    this._isContentRestoring = null;
    this._domCtrl.write(()=> {
      this._renderer.setStyle(this._stroke, "transition", "stroke-dashoffset " + this.strokeRestoreAnimation + " " + this.strokeRestoreDuration + "s");
      this._renderer.setStyle(this._stroke, "stroke-dashoffset", (360 - this.startAt).toString() );
   });
  }

  private _increaseStroke(){
    this._isStrokeRestoring = false;
    this._isContentRestoring = null;
    this._domCtrl.write(()=> {
      this._renderer.setStyle(this._stroke, "transition", "stroke-dashoffset " + this.strokeFillAnimation + " " + this.strokeFillDuration + "s");
      this._renderer.setStyle(this._stroke, "stroke-dashoffset", (360 - this.endAt).toString() );
    });
  }

  private _startAnimation(){
    if (this._isStrokeRestoring == null) { this._reduceContent(); return; }
    if (this._isStrokeRestoring) { this._increaseStroke(); return; }
  }

  private _stopAnimation(){ 
    if (this._isContentRestoring == false) { this._restoreContent(); return; }
    if (this._isContentRestoring) { return; }
    this._restoreStroke();
  }

  private _strokeTransitionEnd(){
    this._strokeChargeComplete = this._stroke.style.strokeDashoffset == (360 - this.endAt) ? true : false;
    if (this._strokeChargeComplete) { this.onChargeComplete.emit(true); return; }
    this._restoreContent();
  }

  private _contentTransitionEnd(){
    if (this._isContentRestoring) { return; }
    this._increaseStroke();
  }
}
