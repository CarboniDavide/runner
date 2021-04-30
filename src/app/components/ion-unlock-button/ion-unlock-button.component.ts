import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { DomController, Platform } from '@ionic/angular';

@Component({
  selector: 'ion-unlock-button',
  templateUrl: './ion-unlock-button.component.html',
  styleUrls: ['./ion-unlock-button.component.scss'],
})
export class IonUnlockButtonComponent implements AfterViewInit, OnInit {

  @Input() labelTip: string = "Slide to Unlock";
  @Input() successLabelTip: string = "";
  @Input() height: string = "100px";
  @Input() width: string = "200px";
  @Input() sliderColor: string = "#FDEB9C";
  @Input() potColor: string = "#E67E22";
  @Input() transition: string = '0.25s ease-out';

  @Output() onSuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSwipe: EventEmitter<any> = new EventEmitter<any>();

  min?: number = null;
  max?: number = null;
  swipestart: boolean = false;
  potIndex: number = 0;
  potStartIndex: number = 0;

  potElm: HTMLElement;
  slider: HTMLElement;

  constructor(
    private _element: ElementRef,
    private _renderer: Renderer2,
  ) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.potElm = this._element.nativeElement.querySelector("#slideunlock-label");
    this.slider = this._element.nativeElement.querySelector("#slideunlock-slider");
    this._renderer.listen(this.potElm, "mousedown",  (e) => { this.handerIn(e); } );
    this._renderer.listen(this.potElm, "mousemove",  (e) => { this.handerMove(e); } );
    this._renderer.listen(this.potElm, "mouseup",    (e) => { this.handerOut(e); } );
    this._renderer.listen(this.potElm, "mouseout",   (e) => { this.handerOut(e); } );
    this._renderer.listen(this.potElm, "touchstart", (e) => { this.handerIn(e); } );
    this._renderer.listen(this.potElm, "touchmove",  (e) => { this.handerMove(e); } );
    this._renderer.listen(this.potElm, "touchend",   (e) => { this.handerOut(e); } );
  }

  handerIn(event){
    this.swipestart = true;
    this.min = this.slider.getBoundingClientRect().left;
    this.max = this.slider.getBoundingClientRect().width - this.potElm.getBoundingClientRect().width;
    this.potStartIndex = event.type == "touchstart" ? event.touches[0].pageX : event.clientX;
  }

  handerOut(event){
    this.swipestart = false;
    if (this.potIndex < this.max) { this.reset(); }
  }

  handerMove(event){
    if (!this.swipestart) { return; }
    let cX = event.type == "touchmove" ? event.touches[0].pageX : event.clientX;
    this.potIndex = cX - this.potStartIndex;

    if(this.potIndex >= this.max){
      this.potIndex = this.max;
      this.swipestart = false;
      this.onSuccess.emit(true);
    }

    if (this.potIndex < 0){ this.potIndex = 0; }
    this.onSwipe.emit(true);
  }

  reset(){
    this.potIndex = 0;
  }

}
