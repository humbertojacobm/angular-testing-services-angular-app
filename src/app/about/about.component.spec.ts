import { ComponentFixture, TestBed } from "@angular/core/testing"

import {AboutComponent} from './about.component'
import { HighlightDirective } from '../shared/highlight.directive';
import { NO_ERRORS_SCHEMA } from '@angular/core';
fdescribe("about component",()=>{
    let fixture: ComponentFixture<AboutComponent>;
    beforeEach(()=>{
        fixture =TestBed.configureTestingModule({
            declarations: [AboutComponent,HighlightDirective],
            schemas: [NO_ERRORS_SCHEMA]
        }).createComponent(AboutComponent);
        fixture.detectChanges();
    })
    it("should have skyeBlue",()=>{
        const h2 = fixture.nativeElement.querySelector("h2");
        const bgColor = h2.style.backgroundColor;
        expect(bgColor).toBe("skyblue","bgColor should be skyblue")
    });
    
})