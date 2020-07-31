import { ComponentFixture, TestBed, fakeAsync, tick, async } from "@angular/core/testing";
import {TwainComponent} from "./twain.component"
import { Observable, of, throwError, interval } from 'rxjs';
import { TwainService } from './twain.service';
import { delay, take, last } from 'rxjs/operators';
import { asyncData } from '../shared/help';
import {cold, getTestScheduler} from 'jasmine-marbles';

class TwainServiceStub{
    getQuote(): Observable<string>{
        return of("value");
    }
}
fdescribe("twain component",()=>{
    let fixture: ComponentFixture<TwainComponent>;
    let comp: TwainComponent;
    let testQuote: string;
    let getQuoteSpy: any;
    let quoteEl: any;
    // let twainService: TwainService;    
    const errorMessage=()=>{
        const el = fixture.nativeElement.querySelector(".error");
        return el ? el.textContent : null;
    }
    // const errorMessage = () => {
    //     const el = fixture.nativeElement.querySelector(".error");
    //     return el ? el.textContent : null;
    //   };

    beforeEach(()=>{
        testQuote = 'Test Quote';
        //mocking.
        const twainService = jasmine.createSpyObj('TwainService',['getQuote']);
        getQuoteSpy= twainService.getQuote.and.returnValue(asyncData(testQuote));

        TestBed.configureTestingModule({
           declarations: [TwainComponent],
           providers:[{provide: TwainService, useValue: twainService}]
        });
        fixture = TestBed.createComponent(TwainComponent);
        comp = fixture.componentInstance;
        // twainService = TestBed.inject(TwainService);
        quoteEl = fixture.nativeElement.querySelector('.twain');
    });
    it("shoul be component",()=>{
        expect(comp).toBeTruthy();
    });

    it("should run ngOnInit",()=>{
        fixture.detectChanges();//ngOnInit
        expect(comp).toBeTruthy();
    });
    it("should show quote after component initialized",fakeAsync(()=>{
        fixture.detectChanges();//ngOnInit        
        tick();//resolver todos los request asincronos pendientes inclusive los que estan mockeados.
        fixture.detectChanges();
        expect(quoteEl.textContent).toBe(testQuote);
        expect(getQuoteSpy.calls.any()).toBe(true,'getQuote called');
    }));
    it("should show quote after getQuote (async)", async(()=>{
         //ngOninit
         fixture.detectChanges();
         expect(quoteEl.textContent).toBe("...");
         //wait for async getQuotes
         fixture.whenStable().then(()=>{
             //update view with Quotes
             fixture.detectChanges();
             expect(quoteEl.textContent).toBe(testQuote);
             expect(errorMessage()).toBeNull("should not show error");
         })
    }));
    it("should show last quote (quote done)",(done: DoneFn)=>{
        fixture.detectChanges();
        comp.quote.pipe(last()).subscribe(()=>{
          fixture.detectChanges();
          expect(quoteEl.textContent).toBe(testQuote);
          expect(errorMessage()).toBeNull('should not show error');
          done();
        });
    })
    it("should show quote after getQuote (spy done)", (done: DoneFn)=>{
        fixture.detectChanges();
        getQuoteSpy.calls.mostRecent().returnValue.subscribe(()=>{
            fixture.detectChanges();
            expect(quoteEl.textContent).toBe(testQuote);
            expect(errorMessage()).toBeNull("should not show error");
            done();
        })
    });
    it("should show quote after getQuote (marbles)",()=>{
        //observables test quote value and complete(), after delay

        const q$ = cold('---x|',{x: testQuote});
        getQuoteSpy.and.returnValue(q$);
        fixture.detectChanges();//ngOninit
        expect(quoteEl.textContent).toBe("...","should show place holder");
        //flush the observables
        getTestScheduler().flush();
        //update the view
        fixture.detectChanges();
        expect(quoteEl.textContent).toBe(testQuote,"should show quote");
        expect(errorMessage()).toBeNull("should not show error");
    })

    it("sholud display error when TwainService fails", fakeAsync(()=>{
        //observable error after delay
        const q$ = cold('---#|',null,new Error('TwainService test failure'));
        getQuoteSpy.and.returnValue(q$);

        //ngOninit and first refresh of view
        fixture.detectChanges();
        expect(quoteEl.textContent).toBe("...","should be placeholder");
        
        //emit the observables
        getTestScheduler().flush();
        //wait for the setTimeOut
        tick();
        //update the view again
        fixture.detectChanges();
        expect(quoteEl.textContent).toBe("...","should be placeholder");
        expect(errorMessage()).toMatch(/test failure/i,"should show the error message")

    }))

    it("should display error when TwainService fails", fakeAsync(()=>{
       getQuoteSpy.and.returnValue(
           throwError('TwainService test failure')
       )
       
       fixture.detectChanges();
       tick();//simulate the timeout
       fixture.detectChanges();//update the error message witint setTimeout
       expect(errorMessage()).toMatch(/test failure/,'should display the error');
       expect(quoteEl.textContent).toBe('...','should show placeholder');
    }));
    it("should not run new macro task callback with delay after call tick with millis",fakeAsync(()=>{
        function nestedTimer(cb: ()=>any): void{setTimeout(()=> setTimeout(()=>cb()))}
        const callback = jasmine.createSpy('callback');
        nestedTimer(callback);
        expect(callback).not.toHaveBeenCalled();
        tick(0,{processNewMacroTasksSynchronously: false});
        expect(callback).not.toHaveBeenCalled();
        tick(0);
        expect(callback).toHaveBeenCalled();
    }))
    it("should get diff correctlyin fakeAsync",fakeAsync(()=>{
        const start = Date.now();
        tick(100);
        const end = Date.now();
        expect(end - start).toBe(100);
    }))
    describe("use jasmine.clock()",()=>{
        beforeEach(()=> jasmine.clock().install());
        afterEach(()=> jasmine.clock().uninstall());
        it("should auto enter fakeAsync",()=>{
            let called = false;
            setTimeout(()=> {called = true},100);
            jasmine.clock().tick(100);
            expect(called).toBeTruthy();
        })
    })
    it("should get date diff correctly in fakeAsync with rxjs scheduler",fakeAsync(()=>{
       let result = null;
       of('hello').pipe(delay(1000)).subscribe(v => {
           result = v;
       })
       expect(result).toBeNull();
       tick(1000);
       expect(result).toBe("hello");

       const start = new Date().getTime();
       let dateDiff= 0;
       interval(1000).pipe(take(2)).subscribe( ()=>{
        dateDiff = new Date().getTime()-start;
       });
       tick(1000);
       expect(dateDiff).toBe(1000);
       tick(1000);
       expect(dateDiff).toBe(2000);
    }))

})