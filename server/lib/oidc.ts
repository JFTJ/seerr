import { getSettings } from '@server/lib/settings';
import * as client from 'openid-client';

let config: client.Configuration | null = null;

export async function initOidc() {
  const oidcSettings = getSettings().oidc;

  if (!oidcSettings.enabled) {
    throw new Error('OIDC is not enabled in settings');
  }

  config = await client.discovery(
    new URL(oidcSettings.authority),
    oidcSettings.clientId,
    oidcSettings.clientSecret
  );
}

export function getOidcConfig(): client.Configuration {
  if (!config) {
    throw new Error('OIDC not initialized. Call initOidc() first.');
  }
  return config;
}
