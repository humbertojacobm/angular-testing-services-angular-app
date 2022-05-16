import { DebugElement } from '@angular/core';

export * from './test-hero.service';

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

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/