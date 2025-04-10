import { client } from '@passwordless-id/webauthn';
import {
  AuthenticateOptions,
  AuthenticationResponseJSON,
  RegisterOptions,
  RegistrationJSON,
} from '@passwordless-id/webauthn/dist/esm/types';

import {
  getWebAuthnChallenge,
  verifyWebAuthnAuthentication,
  verifyWebAuthnRegistration,
} from './api/auth';

export const useWebAuthClient = () => {
  const getChallenge = async () => {
    const challenge = await getWebAuthnChallenge();

    return challenge;
  };

  const createRegistration = async (options: RegisterOptions) => {
    return client.register(options);
  };

  const verifyRegistration = async (
    challenge: string,
    response: RegistrationJSON,
  ) => {
    return verifyWebAuthnRegistration({
      challenge,
      response,
    });
  };

  const createAuthentication = async (options: AuthenticateOptions) => {
    return await client.authenticate(options);
  };

  const verifyAuthentication = async (
    challenge: string,
    response: AuthenticationResponseJSON,
  ) => {
    return verifyWebAuthnAuthentication({
      challenge,
      response,
    });
  };

  return {
    getChallenge,
    createRegistration,
    verifyRegistration,
    createAuthentication,
    verifyAuthentication,
  };
};
