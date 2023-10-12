import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../environments/environment'
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalRedirectComponent, MsalService, ProtectedResourceScopes } from '@azure/msal-angular';
import { IPublicClientApplication, InteractionType, LogLevel, PublicClientApplication } from '@azure/msal-browser';


function MsalInstanceFactory(): IPublicClientApplication{
    return new PublicClientApplication({
        auth: {
            clientId: environment.azure.clientId,
            authority: `${environment.azure.instance}${environment.azure.tenantId}`,
            redirectUri: environment.azure.redirectUri,
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

function MsalInterceptorConfigFacory(): MsalInterceptorConfiguration{
    const myProtectedResourcesMap = new Map<string, Array<string | ProtectedResourceScopes> | null>();
    myProtectedResourcesMap.set('https://graph.microsoft.com/v1.0/me', [{
        httpMethod: 'GET',
        scopes: ['user.read']
    }]);

    return{
        interactionType: InteractionType.Popup,
        protectedResourceMap: myProtectedResourcesMap
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
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true
        },
        {
            provide: MSAL_INTERCEPTOR_CONFIG,
            useFactory: MsalInterceptorConfigFacory
        },
        MsalService,
        MsalBroadcastService,
        MsalGuard
    ],
    bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
