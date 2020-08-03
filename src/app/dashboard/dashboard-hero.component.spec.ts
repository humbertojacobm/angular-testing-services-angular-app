import { TestBed, ComponentFixture } from "@angular/core/testing"
import {By} from '@angular/platform-browser';

import {DashboardHeroComponent} from './dashboard-hero.component'
import { Hero } from '../model/hero';
import { click} from '../model/testing/index'
import { Component } from '@angular/core';

@Component({
    template:`
      <dashboard-hero
         [hero]=hero
         (selected)=onSelected($event)
      >
      </dashboard-hero>
    `
})
class TestHostComponent{
    hero: Hero = {id: 42, name: "Test Name"};
    selectedHero: Hero;
    onSelected(hero: Hero){
        this.selectedHero = hero;
    }

}

fdescribe("testing dashboard hero with TestHostComponent",()=>{
    let fixture: ComponentFixture<TestHostComponent>;
    let testHost : TestHostComponent;
    let heroEl: any;
    beforeEach(()=>{
        TestBed.configureTestingModule({
            declarations: [DashboardHeroComponent,TestHostComponent]
        });
        fixture = TestBed.createComponent(TestHostComponent);
        testHost = fixture.componentInstance;
        heroEl = fixture.nativeElement.querySelector('.hero');
        fixture.detectChanges();
    });

    it('should display hero name',()=>{
        const expectedPipedName = testHost.hero.name.toUpperCase();
        expect(heroEl.textContent).toContain(expectedPipedName);
    })
    it("should raise selected event when clicked", ()=>{
        click(heroEl);
        expect(testHost.selectedHero).toEqual(testHost.hero);
    })

})

fdescribe("dashboard hero block",()=>{
    let fixture: ComponentFixture<DashboardHeroComponent>;
    let comp: DashboardHeroComponent;
    let heroDe: any;
    let heroEl: any;
    let expectedHero: any;

    beforeEach(()=>{
        TestBed.configureTestingModule({
            declarations:[DashboardHeroComponent]
        });
        fixture = TestBed.createComponent(DashboardHeroComponent);
        comp = fixture.componentInstance;
        
        //find de debugElement and element (.hero)
        heroDe = fixture.debugElement.query(By.css(".hero"));
        heroEl = heroDe.nativeElement;

        //mock the hero parameters supplied by the parent
        expectedHero = {id: 42, name: 'Test Name'};

        comp.hero={...expectedHero};

        //trigger initial databinding
        fixture.detectChanges();
    })
    it("should display the hero name in uppercase",()=>{
        expect(heroEl.textContent).toContain(expectedHero.name.toUpperCase());
    })
    it("should raise selected event when clicked (trigger event handler)",()=>{
        let selectedHero: Hero;
        comp.selected.subscribe((hero: Hero)=>{
           selectedHero = hero;
        });
        heroDe.triggerEventHandler("click",null);
        expect(selectedHero).toEqual(expectedHero);
    })

    it("should raise selected event when clicked (element.click)",()=>{
        let selectedHero: Hero;
        comp.selected.subscribe((hero: Hero)=>{
           selectedHero = hero;
        });
        heroEl.click();
        expect(selectedHero).toEqual(expectedHero);
    })
    it("should raise selected event when clicked (click helper)",()=>{
        let selectedHero: Hero;
        comp.selected.subscribe((hero: Hero)=>{
           selectedHero = hero;
        });
        click(heroDe);
        click(heroEl);
        expect(selectedHero).toEqual(expectedHero);
    })
})