import { ComponentFixture, TestBed } from "@angular/core/testing";
import {TwainComponent} from "./twain.component"
import { Observable, of } from 'rxjs';
import { TwainService } from './twain.service';
class TwainServiceStub{
    getQuote(): Observable<string>{
        return of("value");
    }
}
fdescribe("twain component",()=>{
    let fixture: ComponentFixture<TwainComponent>;
    let comp: TwainComponent;
    let twainService: TwainService;
    beforeEach(()=>{
        TestBed.configureTestingModule({
           declarations: [TwainComponent],
           providers:[{provide: TwainService, useClass: TwainServiceStub}]
        });
        fixture = TestBed.createComponent(TwainComponent);
        comp = fixture.componentInstance;
        twainService = TestBed.inject(TwainService);
    });
    it("shoul be component",()=>{
        expect(comp).toBeTruthy();
    });

    it("should run ngOnInit",()=>{
        fixture.detectChanges();//ngOnInit
        expect(comp).toBeTruthy();
    });

})