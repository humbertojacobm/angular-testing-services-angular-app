import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import {TwainComponent} from "./twain.component"
import { Observable, of, throwError } from 'rxjs';
import { TwainService } from './twain.service';
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
        getQuoteSpy= twainService.getQuote.and.returnValue(of(testQuote));

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
    it("should show quote after component initialized",()=>{
        fixture.detectChanges();//ngOnInit
        expect(quoteEl.textContent).toBe(testQuote);
        expect(getQuoteSpy.calls.any()).toBe(true,'getQuote called');
    });
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

})