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
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { first } from 'rxjs/operators';
import { SharedModule } from '../shared/shared.module';

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
    describe("when override its provided HeroDetailService", overrideSetup);
    describe("with FormsModule setup", formsModuleSetup);
    describe("with ShareModule setup", sharedModuleSetup)
})
///////

function overrideSetup(){
    class HeroDetailServiceSpy{
        testHero: Hero = {id: 42, name: 'Test Hero'}
        getHero = jasmine.createSpy('getHero').and.callFake(
            ()=> {
                return asyncData(Object.assign({},this.testHero));
            }
        );
        saveHero = jasmine.createSpy('saveHero').and.callFake(
           (hero: Hero)=>{
               return asyncData(Object.assign(this.testHero, hero));
           }
        );
    }

    beforeEach(()=>{
        activatedRoute.setParamMap({id:999999});
    });

    beforeEach(async(() => {
        const routerSpy = createRouterSpy();
    
        TestBed.configureTestingModule({
          imports:   [ HeroModule ],
          providers: [
            { provide: ActivatedRoute, useValue: activatedRoute },
            { provide: Router,         useValue: routerSpy},
            // HeroDetailService at this level is IRRELEVANT!
            { provide: HeroDetailService, useValue: {} }
          ]
        })
    
        // Override component's own provider
        .overrideComponent(HeroDetailComponent, {
          set: {
            providers: [
              { provide: HeroDetailService, useClass: HeroDetailServiceSpy }
            ]
          }
        })
    
        .compileComponents();
      }));

    let hdsSpy: HeroDetailServiceSpy;

    beforeEach(async(() => {
        createComponent();
        // get the component's injected HeroDetailServiceSpy
        hdsSpy = fixture.debugElement.injector.get(HeroDetailService) as any;
      }));

    it('should have called `getHero`', () => {
        expect(hdsSpy.getHero.calls.count()).toBe(1, 'getHero called once');
    });

    it("it should display stub hero's name", ()=>{
        expect(page.nameDisplay.textContent).toContain(hdsSpy.testHero.name);
    })
    it("should have stub hero change",fakeAsync(()=>{
       click(page.saveBtn);
       tick();
       expect(hdsSpy.saveHero.calls.count()).toBe(1,"saveHero was called");
    }))

    it('should save stub hero change v2', fakeAsync(()=>{
        const origName = hdsSpy.testHero.name;
        const newName = "New Name";

        page.nameInput.value = newName;
        page.nameInput.dispatchEvent(newEvent('input'));

        expect(component.hero.name).toBe(newName,"the component is getting the new name");
        expect(hdsSpy.testHero.name).toBe(origName,"spy service should have the previos name");

        click(page.saveBtn);
        expect(hdsSpy.saveHero.calls.count()).toBe(1,"the hdsSpy.saveHero should be called ");

        tick();
        expect(hdsSpy.testHero.name).toBe(newName,"spy service should have the new name");
        expect(page.navigateSpy.calls.count()).toBe(1,"router.navigate should be called");

    }))

    it('fixture injected service is not the component injected service',()=>{
        inject([HeroDetailService],(fixtureService: HeroDetailService) =>{
            const componentService = fixture.debugElement.injector.get(HeroDetailService);
            expect(fixtureService).not.toBe(componentService,"the injected service is not the same that component service");
        })
    })


}

/////////
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
    //why we must use `fixture.debugElement.injector` in `Page()`
    it("cannot use `inject` to get component\'s provided HeroDetailService",()=>{
        let service: HeroDetailService;
        
        expect(
            inject([HeroDetailService],(hds: HeroDetailService) => service = hds)
        ).toThrowError(/No provider for HeroDetailService/);
        
        //get 'HeroDetailSErvice' with component's own injector
        fixture = TestBed.createComponent(HeroDetailComponent);
        service = fixture.debugElement.injector.get(HeroDetailService);
        expect(service).toBeDefined("debugElement.injector");
        

    })

}

function formsModuleSetup(){
    beforeEach(async(()=>{
        const routerSpy = createRouterSpy();
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [HeroDetailComponent, TitleCasePipe],
            providers:[
                {
                    provide: ActivatedRoute, useValue: activatedRoute
                },
                {
                    provide: HeroService,    useClass: TestHeroService
                },
                {
                    provide: Router,         useValue: routerSpy
                }
            ]
        })
        .compileComponents();
    }))
    it('should display 1st hero\'s name', async(() => {
        const expectedHero = firstHero;
        activatedRoute.setParamMap({ id: expectedHero.id });
        createComponent().then(() => {
          expect(page.nameDisplay.textContent).toBe(expectedHero.name);
        });
      }));
}

function sharedModuleSetup(){
    beforeEach(async(()=>{
        const routerSpy = createRouterSpy();
        TestBed.configureTestingModule({
            imports: [SharedModule],
            declarations: [HeroDetailComponent],
            providers: [
                {
                    provide: ActivatedRoute, useValue: activatedRoute
                },
                {
                    provide: HeroService, useClass: TestHeroService
                },
                {
                    provide: Router, useValue: routerSpy
                }
            ]
        })
        .compileComponents();
    }))
    it("should display hero name", async(()=>{
        const expectedHero = firstHero;
        activatedRoute.setParamMap({id: expectedHero.id});
        createComponent().then(()=>{
           expect(page.nameDisplay.textContent).toBe(expectedHero.name, "should the same")
        })

    }))
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
