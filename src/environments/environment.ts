// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    azure: {
        instance: "https://login.microsoftonline.com/",
        tenantId: "88ec1aaa-2567-4903-a844-323214135e1e",
        clientId: "e5d0c32d-431e-4aaf-9c30-90b0a088e3af",
        scopes: [
          {
            key: "https://graph.microsoft.com/v1.0/me",
            value: ["user.read"]
          }
        ],
        redirectUri: "/auth"
      },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
