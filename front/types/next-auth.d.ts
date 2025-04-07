import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      name: string | null;
      email: string | null;
      id: string;
      organization_id: string;
      access_token: string;
    };
    expires: ISODateString;
  }
}
