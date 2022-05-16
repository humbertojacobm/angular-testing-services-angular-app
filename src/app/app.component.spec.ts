import { TestBed, ComponentFixture } from "@angular/core/testing"
import { NO_ERRORS_SCHEMA, Component, DebugElement } from '@angular/core'
import { By } from '@angular/platform-browser'

import {AppComponent} from './app.component'
import { RouterLinkDirectiveStub} from './testing/router-link-directive-stub'
import { click } from './model/testing'


@Component({
    selector:'app-banner',template:''
})
class BannerStubComponent{}

fdescribe("app component block",()=>{
    let fixture: ComponentFixture<AppComponent>;
    let linkDes: DebugElement[];
    let routerLinks: RouterLinkDirectiveStub[];
    beforeEach(()=>{
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                BannerStubComponent,
                RouterLinkDirectiveStub
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });
        fixture = TestBed.createComponent(AppComponent);
    })

    beforeEach(()=>{
        fixture.detectChanges();
        linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
        routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
    })

    it("can get RouterLinks from template",()=>{
        expect(routerLinks.length).toBe(3,"should have 3 router link");
        expect(routerLinks[0].linkParams).toBe("/dashboard","matching with /dashboard");
        expect(routerLinks[1].linkParams).toBe("/heroes","matching with /heroes");
        expect(routerLinks[2].linkParams).toBe("/about","matching with /about");
        
    })

    it("can click Heroes link in template",()=>{
        
        const herosLink = routerLinks[1];
        const herosLinkDe = linkDes[1];
        expect(herosLink.navigatedTo).toBe(null,"should not have navigate yet");

        click(herosLinkDe);

        expect(herosLink.navigatedTo).toBe("/heroes","should be /heroes")
    })
})
