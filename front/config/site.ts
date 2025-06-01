export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Foodly',
  apps: {
    title: 'Foodly Booking',
    description: 'Foodly Booking App',
    routes: {
      home: '/',
      history: '/my-order',
      my_group: '/my-group',
      my_page: '/my-page',
      group: {
        detail: '/group/:id',
      },
    },
    apiRoutes: {
      login: '/auth/sign-in',
      google_login: '/auth/google',
      register: '/auth/sign-up',
      my_info: '/auth/user-info',
      update_user_info: '/auth/user-info',
      update_password: '/auth/change-password',
      reset_password: '/auth/reset-password',
      verify_reset_password: '/auth/verify-reset-password-token',
      set_first_password: '/auth/set-password',
      webauthn: {
        generate_challenge: '/auth/webauth/register',
        verify_registration: '/auth/webauth/register/verify',
        verify_authentication: '/auth/webauth/authenticate',
      },
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
  description: '',
  routes: {
    home: '/',
  },
  apiRoutes: {},
} as const;
