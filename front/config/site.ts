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
          detail: '/foodly/group/:id',
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
          check: '/groups/:id/check',
          lock: '/groups/:id/lock',
          delete: '/groups/:id',
          update: '/groups/:id',
        },
        order: {
          list: '/orders',
          create: '/orders',
          edit: '/orders/:id',
          mark_paid: '/orders/:id/mark-paid',
          cancel: '/orders/:id/cancel',
          confirm_paid: '/orders/:id/confirm-paid',
          mark_paid_all: '/orders/mark-paid-all',
          confirm_paid_all: '/orders/confirm-paid-all',
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
