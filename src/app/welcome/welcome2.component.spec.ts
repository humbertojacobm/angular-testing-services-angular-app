import { UserService } from "../model/user.service"
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';

fdescribe("welcome 2",()=>{
    let userServiceStub: Partial<UserService>;
    let fixture : ComponentFixture<WelcomeComponent>;
    let comp: WelcomeComponent;
    let el: any;

    beforeEach(async(()=>{   
        userServiceStub = {
            isLoggedIn: true,
            user: { name: 'Test User' },
            };                 
        TestBed.configureTestingModule({
            declarations:[WelcomeComponent],
            providers: [{provide: UserService, useValue: userServiceStub}]
        });   
        fixture = TestBed.createComponent(WelcomeComponent);
        comp = fixture.componentInstance;
        userServiceStub = TestBed.inject(UserService); 
        el = fixture.nativeElement.querySelector('.welcome');    
    }));

    it('should welcome the user', ()=>{              
        fixture.detectChanges();     
        const content = el.textContent;
        expect(content).toContain('Welcome','"Welcome ...."');
        expect(content).toContain("Test User",'expected name');
    });
    it('should be bubba',()=>{
        userServiceStub.user.name="bubba";
        fixture.detectChanges();//fire the changes in lifecycle
        expect(el.textContent).toContain("bubba");        
    })
    it('should fail the login',()=>{
        userServiceStub.isLoggedIn = false;
        fixture.detectChanges();
        const content = el.textContent;
        expect(content).not.toContain("Welcome");
        expect(content).toMatch(/log in/i);
    });
    

})