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
        
        const testData: Data = {name: 'Test Data'};
        const testUrl = "/api";
        //asert
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

    xit('can test httpClient.get with headers',()=>{
        
        const testData: Data = {name: 'Test Data'};
        const testUrl = "/api";
        //asert
        httpClient.get<Data>(testUrl).subscribe( data =>{
            expect(data).toEqual(testData);
        });

        //mocking 4
        // const req = httpTestingController.expectOne(testUrl);

        // const req = httpTestingController.expectOne(
        //     req => req.headers.has('Authorization')
        // );

        const requests = httpTestingController.match(testUrl);
        expect(requests.length).toBe(3);

        requests[0].flush([]);
        requests[1].flush([testData[0]]);
        requests[2].flush(testData);

        // expect(req.request.method).toBe("GET");

        // req.flush(testData);
        
        //mockin 5
        httpTestingController.verify();
    })    

    it('can test for 404 error', ()=>{
        const testData: Data = {name: 'Test Data'};
        const testUrl = "/api";
        const emsg = 'deliberate 404 error';
        httpClient.get<Data[]>(testUrl).subscribe(
            data => fail('should have failed'),
            (error: HttpErrorResponse) =>{
                expect(error.status).toEqual(404, 'status');
                expect(error.error).toEqual(emsg,'message');
            }
        );

        const req = httpTestingController.expectOne(testUrl);
        req.flush(emsg,{status: 404, statusText: 'Not Found'});
    })

    it("can test for network error",()=>{
        const testData: Data = {name: 'Test Data'};
        const testUrl = "/api";        
        const emsg = 'simulated network error' ;
        httpClient.get<Data[]>(testUrl).subscribe(
            data => fail('should have failed with the network error'),
            (error: HttpErrorResponse) => {                
                expect(error.error.message).toEqual(emsg,"message");
            }
        )

        const req = httpTestingController.expectOne(testUrl);

        const mockError = new ErrorEvent('Network Error',{
            message: emsg
        })

        req.error(mockError);

    })

})

class Data{
    name: string;
}