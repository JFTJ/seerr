import logger from '@server/logger';
import * as client from 'openid-client';

export interface OidcConfig {
  authority: URL;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
  scope: string;
}

// Hardcoded OIDC provider configuration
// TODO: Move to settings/database configuration
export const oidcConfig: OidcConfig = {
  authority: new URL('https://keycloak.home.arpa/realms/homelab'),
  clientId: 'seerr-dev',
  clientSecret: process.env.OIDC_CLIENT_SECRET || '',
  redirectUri: 'http://localhost:5055/api/v1/auth/oidc/callback',
  postLogoutRedirectUri: 'http://localhost:5055/',
  scope: 'openid profile',
};

export let config: client.Configuration;

export async function initOidc() {

  try {
    config = await client.discovery(
      oidcConfig.authority,
      oidcConfig.clientId,
      oidcConfig.clientSecret
    );
  } catch (e) {
    logger.error('Failed to read authority discovery document', {
      label: 'OIDC',
      error: e,
    });
    throw new Error('Failed to read authorithy discovery document');
  }
}
