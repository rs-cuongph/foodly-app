export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Foodly App',
  description: '',
  routes: {
    home: '/',
    history: '/history-order',
    my_group: '/my-group',
  },
  apiRoutes: {
    login: '/auth/sign-in',
    register: '/auth/sign-up',
    my_info: '/auth/user-info',
  },
} as const;
