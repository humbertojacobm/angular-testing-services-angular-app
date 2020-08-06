import { async, 
         ComponentFixture, 
         fakeAsync,
         inject,
         TestBed,          
         tick } 
         from '@angular/core/testing';

import { Router } from '@angular/router'; 

import { newEvent,
         click,
         ActivatedRoute,
         asyncData,
         ActivatedRouteStub} 
       from "../testing"


import { Hero } from "../model/hero"
import {HeroDetailComponent} from './hero-detail.component'
import { HeroDetailService } from './hero-detail.service';
import { HeroModule} from './hero.module'
import { HeroService, TestHeroService, getTestHeroes } from '../model/testing';

///////testing vars//////
let activatedRoute: ActivatedRouteStub;
let component: HeroDetailComponent;
let fixture: ComponentFixture<HeroDetailComponent>;
let page: Page;

////tests/////
fdescribe("HeroDetailComponent",()=>{
    beforeEach(()=>{
        activatedRoute = new ActivatedRouteStub();
    });

    describe("with HeroModule setup", heroModuleSetup);
})

const firstHero = getTestHeroes()[0];

function heroModuleSetup(){
    beforeEach(async(()=>{
        const routerSpy = createRouterSpy();
        TestBed.configureTestingModule({
            imports: [HeroModule],
            providers:[
                {provide: ActivatedRoute, useValue: activatedRoute},
                {provide: Router, useValue: routerSpy},
                {provide: HeroService, useClass: TestHeroService}
            ]
        }).compileComponents();
    }));

    describe("when navigate to existing hero",()=>{
        let expectedHero: Hero;
        beforeEach(async(()=>{
            expectedHero = firstHero;
            activatedRoute.setParamMap({id: expectedHero.id});
            createComponent();
        }))
        it('should display that hero name',()=>{
            expect(page.nameDisplay.textContent).toBe(expectedHero.name);
        })
        it('should navigate when click cancel',()=>{
            click(page.cancelBtn);
            expect(page.gotoListSpy).toHaveBeenCalled();
            expect(page.navigateSpy).toHaveBeenCalled();
            expect(page.navigateSpy.calls.any()).toBe(true,'this.router.navigate called');

        })
        it("should save when click save but not navigate inmediately",()=>{
            const hds = fixture.debugElement.injector.get(HeroDetailService);
            const saveSpy = spyOn(hds,'saveHero').and.callThrough();

            click(page.saveBtn);    
            expect(saveSpy.calls.any()).toBe(true,"heroDetailService.saveHero is called");
            expect(page.navigateSpy.calls.any()).toBe(false,"not navigate inmediatly");            
            expect(true).toBeTruthy();
        });
        it("should navigate when click save and save resolve",fakeAsync(()=>{
            
            const hds = fixture.debugElement.injector.get(HeroDetailService);
            const saveSpy= spyOn(hds,"saveHero").and.callThrough();
            click(page.saveBtn);
            expect(saveSpy.calls.any()).toBe(true,"heroDetailService.saveHero is called");
            tick();
            expect(page.gotoListSpy.calls.any()).toBe(true,"this.gotoList is called")
            expect(page.navigateSpy.calls.any()).toBe(true,"router.navigate")
            expect(true).toBeTruthy();
        }))
        it("should convert hero name to Title case",()=>{
            page.nameInput.value="quick BROWN fOx";
            page.nameInput.dispatchEvent(newEvent("input"));
            fixture.detectChanges();
            expect(page.nameDisplay.textContent).toContain("Quick Brown Fox");
            expect(true).toBe(true);
        })
    });
    describe("when navigate with no hero id",()=>{
        beforeEach(async(createComponent));
        it("should have hero.id === 0",()=>{
            expect(component.hero.id).toBe(0,"hero.id === 0")
            expect(true).toBeTruthy();
        })
        it("should display empty hero name",()=>{
            expect(page.nameInput.value).toBe('');
            expect(true).toBe(true);
        })
    })
    describe("when navigate to non-existent hero id",()=>{
        beforeEach(async(()=>{
            activatedRoute.setParamMap({id:999999});
            createComponent();
        }))
        it("should try to navigate back to hero list",()=>{
            expect(page.gotoListSpy.calls.any()).toBe(true,"gotoList() is called");
            expect(page.navigateSpy.calls.any()).toBe(true,"router.navigate is called");
            expect(true).toBe(true);
        })
    })

}

class Page {
    // getter properties wait to query the DOM until called.
    get buttons()     { return this.queryAll<HTMLButtonElement>('button'); }
    get saveBtn()     { return this.buttons[0]; }
    get cancelBtn()   { return this.buttons[1]; }
    get nameDisplay() { return this.query<HTMLElement>('span'); }
    get nameInput()   { return this.query<HTMLInputElement>('input'); }
  
    gotoListSpy: jasmine.Spy;
    navigateSpy: jasmine.Spy;
  
    constructor(someFixture: ComponentFixture<HeroDetailComponent>) {
      // get the navigate spy from the injected router spy object
      const routerSpy = someFixture.debugElement.injector.get(Router) as any;
      this.navigateSpy = routerSpy.navigate;
  
      // spy on component's `gotoList()` method
      const someComponent = someFixture.componentInstance;
      this.gotoListSpy = spyOn(someComponent, 'gotoList').and.callThrough();
    }
  
    //// query helpers ////
    private query<T>(selector: string): T {
      return fixture.nativeElement.querySelector(selector);
    }
  
    private queryAll<T>(selector: string): T[] {
      return fixture.nativeElement.querySelectorAll(selector);
    }
}

//////////////////
/** Create the HeroDetailComponent, initialize it, set test variables  */
function createComponent() {
    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
  
    // 1st change detection triggers ngOnInit which gets a hero
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
      // 2nd change detection displays the async-fetched hero
      fixture.detectChanges();
    });
}

///// query helpers /////

function createRouterSpy(){
    return jasmine.createSpyObj('Router',['navigate']);
}
