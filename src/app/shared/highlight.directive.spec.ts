import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightDirective } from './highlight.directive';
import { By } from '@angular/platform-browser';

@Component({
    template: `
        <h2 highlight="yellow">something yellow</h2>
        <h2 highlight>Default gry</h2>
        <h2>No highLight</h2>
        <input #box [highlight]="box.value" value="cyan"/>
    `
})
class TestComponent{}

fdescribe("highlight directive block 02",()=>{
    let fixture: ComponentFixture<TestComponent>;
    let des: DebugElement[];
    let bareH2: DebugElement;
    beforeEach(()=>{
        fixture = TestBed.configureTestingModule({
            declarations: [HighlightDirective, TestComponent]
        })
        .createComponent(TestComponent);

        fixture.detectChanges(); //initial bindings

        des = fixture.debugElement.queryAll(By.directive(HighlightDirective));
        
        bareH2 = fixture.debugElement.query(By.css("h2:not([highlight])"));
    })

    //color tests
    it("should have three highlighted elements",()=>{
        expect(des.length).toBe(3,"should be three elements");
    })
    it("should color 1st <h2> background 'yellow'",()=>{
        expect(des[0].nativeElement.style.backgroundColor).toBe("yellow","should be yellow");
    })
    it("should color 2nd <h2> background w/ default color",()=>{
        expect(des[1].nativeElement.style.backgroundColor).toBe("rgb(211, 211, 211)","should be rgb(211, 211, 211)");
    })

    it("v02 -> should color 2nd <h2> background w/ default color",()=>{
        const dir = des[1].injector.get(HighlightDirective) as HighlightDirective;
        const bgColor = des[1].nativeElement.style.backgroundColor;
        expect(bgColor).toBe(dir.defaultColor,"dom color and directive color should be the same");
    })

    it("should bind <input> background to value color",()=>{
        expect(des[2].nativeElement.style.backgroundColor).toBe("cyan","should be cyan color the first time");
        const domElement = des[2].nativeElement as HTMLInputElement;
        domElement.value='yellow';
        domElement.dispatchEvent(new Event("Input"));
        fixture.detectChanges();
        expect(domElement.style.backgroundColor).toBe("yellow");
    })

    it("bare <h2> should not have a custome Property",()=>{
        expect(bareH2.properties.customeProperty).toBeUndefined();
    })


})