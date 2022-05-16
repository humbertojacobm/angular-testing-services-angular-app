import {HeroService} from './hero.service'
import {Hero} from './hero'
import { defer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

fdescribe("hero service",()=>{
  it("testing",()=>{
      expect(true).toBeTruthy();
  });

  let httpClientSpy: {get: jasmine.Spy};
  let heroService: HeroService;

  beforeEach(()=>{
    //mocking for advanced
     httpClientSpy = jasmine.createSpyObj('HttpClient',['get']);
    heroService = new HeroService(<any>httpClientSpy);
  })

  it('should return expected heroes', ()=>{
    
    const expectedHeroes: Hero[] =[
      {
        id: 1,
        name: "beto"
      },
      {
        id: 2,
        name: "lucho"
      },
    ];
    //mocking
       httpClientSpy.get.and.returnValue(asyncData(expectedHeroes));

    heroService.getHeroes().subscribe((heroes)=>{
        expect(heroes).toBeTruthy();
        expect(heroes).toEqual(expectedHeroes);
    },fail);

    expect(httpClientSpy.get.calls.count()).toBe(1,'one call');
    expect(true).toBeTruthy();

  });

  it("should return an error when the server returns a 404",()=>{
    const errorMessage = "test 404 error"
    const errorResponse = new HttpErrorResponse({
      error: errorMessage,
      status: 404,
      statusText: 'Not Found'
    });

    //mocking
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));

    heroService.getHeroes().subscribe(
      heroes => {
        
        fail('expected an error, not heroes')
      },
      error=>{
        
        expect(error.message).toContain(errorMessage)
      }
    );
  })



})

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

export function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}