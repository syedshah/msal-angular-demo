import { Component, OnDestroy, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
    title = 'msal-angular demo';
    activeUser: string | undefined = "unknown user";
    isAuthenticated = false;

    private unsubscribe = new Subject<void>();

    constructor(private msalService: MsalService, private msalBroadcastService: MsalBroadcastService){}
    
    login(): void{
        this.msalService.instance.loginRedirect({
            scopes: ["User.Read"]
        });
    }

    logout(): void{
        this.msalService.instance.logoutRedirect();
    }

    ngOnInit(): void{
        this.msalBroadcastService.inProgress$
        .pipe(
            filter((status: InteractionStatus) => status === InteractionStatus.None),
            takeUntil(this.unsubscribe)
        )
        .subscribe(() => {
            this.setAuthenticationStatus();
        });

        this.msalBroadcastService.msalSubject$
        .pipe(
            filter((message: EventMessage) => message.eventType === EventType.LOGIN_START),
            takeUntil(this.unsubscribe)
        )
        .subscribe((message: EventMessage) => {
            const authResult = message.payload as AuthenticationResult;
            this.msalService.instance.setActiveAccount(authResult.account);
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next(undefined);
        this.unsubscribe.complete();
    }

    setAuthenticationStatus(): void{
        let activeAccount = this.msalService.instance.getActiveAccount();

        if(!activeAccount && this.msalService.instance.getAllAccounts().length > 0){
            activeAccount = this.msalService.instance.getAllAccounts()[0];
            this.msalService.instance.setActiveAccount(activeAccount);
        }

        this.isAuthenticated = !!activeAccount;
        this.activeUser = activeAccount?.username;
    }
}
