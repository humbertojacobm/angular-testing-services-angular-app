
import { ComponentFixture, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

export * from './activated-route-stub';
export * from './router-link-directive-stub'
export * from './async-observables-helper'


export const ButtonClickEvents = {
    left: {button: 0},
    right: {button: 2}
}

export function click(el: DebugElement | HTMLElement, eventObj: any = ButtonClickEvents.left): void{
  if(el instanceof HTMLElement){
      el.click();
  }else{
      el.triggerEventHandler('click',eventObj);
  }
}

export function newEvent(eventName: string, bubbles = false, cancelable = false) {
    let evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
    evt.initCustomEvent(eventName, bubbles, cancelable, null);
    return evt;
}  

export function advance(f: ComponentFixture<any>):void{
    tick();
    f.detectChanges();
}