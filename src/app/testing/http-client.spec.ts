import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient, HttpErrorResponse} from '@angular/common/http'


fdescribe('HttpClient testing',()=> {
    //mocking step 1
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(()=>{
        //mockin step 2
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        //mocking step 3
        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    })

    afterEach(()=>{
        httpTestingController.verify();
    })

    it('can test httpClient.get',()=>{
        debugger;
        const testData: Data = {name: 'Test Data'};
        const testUrl = "/api";
        httpClient.get<Data>(testUrl).subscribe( data =>{
            expect(data).toEqual(testData);
        });

        //mocking 4
        const req = httpTestingController.expectOne(testUrl);

        expect(req.request.method).toBe("GET");

        req.flush(testData);
        
        //mockin 5
        httpTestingController.verify();


    })


})

class Data{
    name: string;
}