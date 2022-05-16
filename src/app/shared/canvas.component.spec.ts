import { TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { CanvasComponent } from './canvas.component';

fdescribe("canvas block",()=>{
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                            CanvasComponent
                        ],
        }).compileComponents();
    }));
    beforeEach(()=>{
        window['__zone_symbol__FakeAsyncTestMacroTask']=[
            {source: 'HTMLCanvasElement.toBlob',
             callbackArgs: [{size:200}]
            }            
        ]
    })
    it("should be able to generate blob data from canvas", fakeAsync(()=>{
        const fixture = TestBed.createComponent(CanvasComponent);
        const canvasComp = fixture.componentInstance;

        fixture.detectChanges();
        expect(canvasComp.blobSize).toBe(0);
        tick();
        expect(canvasComp.blobSize).toBeGreaterThan(0);
    }))
        
})