import { Hero } from "../model/hero"
import { async } from '@angular/core/testing';
import {ActivatedRouteStub} from '../testing/activated-route-stub'
import { Component } from '@angular/core';

fdescribe("when navigate to existing hero",()=>{
    let expectedHero: Hero;
    let firstHero: Hero = {id: 1, name:"Hero Name"};
    let activatedRouteStub: ActivatedRouteStub;
    beforeEach(async(()=>{
        expectedHero= firstHero;
        activatedRouteStub.setParamMap({id: expectedHero.id});
        // createComponent();

    }));
    // it("should display that hero\'s name",()=>{
    //     // expect(page.nameDisplay.textContent).toBe(expectedHero.name);
    // })

    describe("when navigate to non-existent hero id", ()=>{
        beforeEach(async(()=>{
            activatedRouteStub.setParamMap({id:9999999});
            // createComponent();
        }))

        // it("should try to navigate back to hero list",()=>{
        //     expect(page.gotoListSpy.calls.any()).toBe(true);
        //     expect(page.navigateSpy.calls.any()).toBe(true);
        // })
    })

    // describe("when navigate with no hero id",()=>{
    //     beforeEach(async(createComponent));
    //     it("should have hero.id === 0",() => {
    //         expect(component.hero.id).toBe(0);
    //     })
    //     it("should display empty hero name",()=>{
    //         expect(page.nameDisplay.textContent).toBe('');
    //     })
    // })
})