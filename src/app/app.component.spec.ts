import { TestBed } from "@angular/core/testing"
import { NO_ERRORS_SCHEMA, Component } from '@angular/core'

import {AppComponent} from './app.component'
import { RouterLinkDirectiveStub} from './testing/router-link-directive-stub'

@Component({
    selector:'app-banner',template:''
})
class BannerStubComponent{}

fdescribe("app component block",()=>{
    beforeEach(()=>{
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                BannerStubComponent,
                RouterLinkDirectiveStub
            ],
            schemas: [NO_ERRORS_SCHEMA]
        })
    })
})
