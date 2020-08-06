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
