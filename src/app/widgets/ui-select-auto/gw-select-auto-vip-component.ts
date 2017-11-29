import {Component, Input, OnInit, forwardRef, OnDestroy} from '@angular/core';
import {Store} from "@ngrx/store";
import {serviceState, vipState} from "./ui-select-auto.reducer";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {UiselectAutoService} from "./ui-select-auto.service";
import {Subscription} from "rxjs/Subscription";

export const GW_CHANNEL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GwSelectAutoVipComponentComponent),
  multi: true
};

@Component({
  selector: 'gw-select-auto-vip',
  template: `
    <gw-single-select  [toolbar]="toolbar"
                      label="{{'VIP等级'|translate}}"
                      [data]="vips"
                      [(ngModel)]="value"
                       [closeable]="false"
                      [enabled]="true"
                      [showSelect]="false" 
    ></gw-single-select>
  `,
  styles: [''],
  providers: [GW_CHANNEL_VALUE_ACCESSOR]
})
export class GwSelectAutoVipComponentComponent implements OnInit, ControlValueAccessor ,OnDestroy{

  onChange: any;
  onTouched: any;


  @Input()
  key: string;
  @Input()
  toolbar:any;
  _value:string;
  vips:{id:string,text:string}[];
  enabled:boolean = true;
  $scribtion:Subscription;

  constructor(private  $store: Store<vipState>) {

  }

  ngOnInit() {
    this.$scribtion = this.$store.select('vipAuto').map((state:vipState[])=>{
      state = state.filter(item=>{
        return item.key === this.key;
      });
      return state;
    }).subscribe(result=>{
      this.vips = (result&&result[0]&&result[0].data)||[];
      this.vips = this.vips.filter(item=>{
         return item.id !== '-1';
      })
    })
  }


  set value(value: string) {
    if(this._value!==value){
      this._value = value;
      this.onTouched && this.onTouched();
      this.onChange && this.onChange({id:value,text:''});
    }
  }

  // get value(){
  //   return this._value;
  // }

  writeValue(obj: any): void {
    if(obj&&obj.id){
      this.value = (obj&&obj.id);
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnDestroy(){
    this.$scribtion.unsubscribe();
  }
}
