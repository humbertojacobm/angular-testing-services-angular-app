import { TestBed, ComponentFixture } from "@angular/core/testing"
import {By} from '@angular/platform-browser';

import {DashboardHeroComponent} from './dashboard-hero.component'

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
})