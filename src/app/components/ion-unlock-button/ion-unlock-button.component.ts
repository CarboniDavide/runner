import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { DomController, Platform } from '@ionic/angular';

@Component({
  selector: 'ion-unlock-button',
  templateUrl: './ion-unlock-button.component.html',
  styleUrls: ['./ion-unlock-button.component.scss'],
})
export class IonUnlockButtonComponent implements AfterViewInit, OnInit {

  @Input() labelTip: string = "Slide to Unlock";
  @Input() successLabelTip: string = "Success";
  @Input() IsOk: boolean = false;
  @Input() height: string = "100px";
  @Input() width: string = "200px";
  @Input() transition: string = '0.25s ease-out';

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSwipe: EventEmitter<any> = new EventEmitter<any>();

  min: number = 0;
  max: number = -1;
  swipestart: boolean = false;
  index: number = 0;
  lableIndex: number = 0;

  dragElm: HTMLElement;
  label: HTMLElement;

  constructor(
    private _element: ElementRef,
    private _domCtrl: DomController,
    private _renderer: Renderer2,
    private _platform: Platform
  ) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dragElm = this._element.nativeElement.querySelector(".slideunlock-label");
    this.label = this._element.nativeElement.querySelector(".slideunlock-lable-tip");
    this._renderer.listen(this.dragElm, "mousedown",  (e) => { this.handerIn(e); } );
    this._renderer.listen(this.dragElm, "mousemove",  (e) => { this.handerMove(e); } );
    this._renderer.listen(this.dragElm, "mouseup",    (e) => { this.handerOut(e); } );
    this._renderer.listen(this.dragElm, "mouseout",   (e) => { this.handerOut(e); } );
    this._renderer.listen(this.dragElm, "touchstart", (e) => { this.handerIn(e, "mobile"); } );
    this._renderer.listen(this.dragElm, "touchmove",  (e) => { this.handerMove(e, "mobile"); } );
    this._renderer.listen(this.dragElm, "touchend",   (e) => { this.handerOut(e); } );
  }

  updateView() {
  }

  handerIn(event, type=null){
    this.swipestart = true;
    this.min = 0;
    this.max = this._element.nativeElement.getBoundingClientRect().width;

    let cX = type != null ? event.originalEvent.touches[0].pageX : event.clientX;
    this.lableIndex = cX - this._element.nativeElement.offsetLeft
    this._domCtrl.write(() => this._renderer.setStyle(this.dragElm, 'transition', "none") );
  }

  handerOut(event){
    this.swipestart = false;
    if (this.index < this.max) { this.reset(); }
  }

  handerMove(event, type: any=null){
    if (!this.swipestart) { return; }

    let cX = type != null ? event.originalEvent.touches[0].pageX : event.clientX;
    this.index = cX - this.lableIndex;

    if(this.index >= this.max){
      this.swipestart = false;
      this.IsOk = true;
    }

    if (this.index < 0){
      this.index = this.min;
      this.IsOk = false;
    }

    if (this.index == this.max && this.max > 0 && this.IsOk ){
      this.onSuccess.emit(true);
      console.log("lill")
    }

    this.onSwipe.emit(true);
    this._domCtrl.write(() => this._renderer.setStyle(this.dragElm, 'left', this.index + "px") );
  }

  reset(){
    this.index = 0;
    this._domCtrl.write(() => this._renderer.setStyle(this.dragElm, 'transition', this.transition) );
    this._domCtrl.write(() => this._renderer.setStyle(this.dragElm, 'left', this.index + "px") );
  }

}
