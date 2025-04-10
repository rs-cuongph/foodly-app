export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'My Apps',
  apps: {
    foodly: {
      title: 'Foodly',
      description: 'Foodly App',
      routes: {
        home: '/foodly',
        history: '/foodly/my-payment-history',
        my_group: '/foodly/my-group',
        my_page: '/foodly/my-page',
        group: {
          detail: '/foodly/groups/:id',
        },
      },
      apiRoutes: {
        login: '/auth/sign-in',
        register: '/auth/sign-up',
        my_info: '/auth/user-info',
        group: {
          list: '/groups',
          detail: '/groups/:id',
          create: '/groups',
        },
      },
    },
  },
  description: '',
  routes: {
    home: '/',
  },
  apiRoutes: {
    login: '/auth/sign-in',
    register: '/auth/sign-up',
    my_info: '/auth/user-info',
    webauthn: {
      generate_challenge: '/auth/webauth/register',
      verify_registration: '/auth/webauth/register/verify',
      verify_authentication: '/auth/webauth/authenticate',
    },
  },
} as const;
