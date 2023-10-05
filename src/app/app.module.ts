import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';

import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalRedirectComponent, MsalService } from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';


function MsalInstanceFactory(): IPublicClientApplication{
    return new PublicClientApplication({
        auth: {
            clientId: 'e5d0c32d-431e-4aaf-9c30-90b0a088e3af',
            authority: 'https://login.microsoftonline.com/88ec1aaa-2567-4903-a844-323214135e1e',
            redirectUri: '/auth',
        },
        cache: {
            cacheLocation: 'sessionStorage',
        },
        system: {
            loggerOptions: {
                loggerCallback: (level, message, containspii) => {
                    console.log(message);
                },
                logLevel: LogLevel.Verbose
            }
        }
    });
}

function MsalGuardConfigFactory(): MsalGuardConfiguration{
    return{
        interactionType: InteractionType.Redirect,
        authRequest:{
            scopes: ['user.read']
        }
    }
}

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        ProfileComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatButtonModule,
        MatToolbarModule,
        MatListModule,
        MatMenuModule,
        MatCardModule
    ],
    providers: [
        {
            provide: MSAL_INSTANCE,
            useFactory: MsalInstanceFactory
        },
        {
            provide: MSAL_GUARD_CONFIG,
            useFactory: MsalGuardConfigFactory
        },
        MsalService,
        MsalBroadcastService,
        MsalGuard
    ],
    bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
