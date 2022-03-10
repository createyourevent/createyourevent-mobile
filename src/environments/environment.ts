// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://createyourevent.org/api',
  oidcConfig: {
    client_id: 'mobile_app',
    server_host: 'https://keycloak.createyourevent.org/auth/realms/jhipster',
    redirect_url: window.location.origin + '/callback',
    end_session_redirect_url: window.location.origin + '/logout',
    scopes: 'openid profile',
    pkce: true,
  },
  keycloakConfig: {
    realm: 'jhipster',
    'auth-server-url': 'https://keycloak.createyourevent.org/auth',
    'ssl-required': 'none',
    resource: 'mobile_app',
    'public-client': true,
    'verify-token-audience': true,
    'use-resource-role-mappings': true,
    'confidential-port': 0,
  },
  scheme: 'dev.localhost.ionic:/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
