export const environment = {
  production: true,
  apiUrl: 'https://createyourevent.org/api',
  oidcConfig: {
    client_id: 'mobile_app',
    server_host: 'https://keycloak.createyourevent.org/auth/realms/jhipster',
    redirect_url: window.location.origin + '/callback',
    end_session_redirect_url: window.location.origin + '/logout',
    scopes: 'openid profile',
    pkce: true,
  },
  scheme: 'dev.localhost.ionic:/',
};
