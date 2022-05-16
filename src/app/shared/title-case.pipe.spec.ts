import { TitleCasePipe } from "@angular/common"

fdescribe("title clase",()=>{
    const pipe = new TitleCasePipe();
    it("transforms 'abc' to 'Abc'",()=>{
        expect(pipe.transform('abc')).toBe('Abc');
    });
    
})