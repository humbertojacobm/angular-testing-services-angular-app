import {TestBed} from '@angular/core/testing';
import {WelcomeComponent} from './welcome.component';
import { UserService } from '../model/user.service';


export class MockUserService {
    isLoggedIn = true;
    user = {name: 'Sam Spade'};
  }

fdescribe("welcome",()=>{
    let comp : WelcomeComponent;
    let userService: UserService;
    beforeEach(()=>{
        TestBed.configureTestingModule({
           providers:[WelcomeComponent,
                      {provide: UserService, useClass: MockUserService}
           ]
        });
        comp = TestBed.inject(WelcomeComponent);
        userService = TestBed.inject(UserService);
    });
    it("before construcciont(ngOnInit) the message should be undefined",()=>{
        expect(comp.welcome).toBeUndefined(); 
    });
    it("after ngOnInit if the user is logged the message should have contain", ()=>{
        comp.ngOnInit();
        expect(comp.welcome).toContain(userService.user.name);
    })
    it("after ngOnInit if the user is not logged the message should have contain", ()=>{
        userService.isLoggedIn = false;
        const expectedMessage = "log in";
        comp.ngOnInit();
        expect(comp.welcome).toContain(expectedMessage);
    })

})