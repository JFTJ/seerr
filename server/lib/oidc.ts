import { getSettings } from '@server/lib/settings';
import * as client from 'openid-client';

let config: client.Configuration | null = null;

export async function initOidc() {
  const oidcSettings = getSettings().oidc;

  if (!oidcSettings.enabled) {
    throw new Error('OIDC is not enabled in settings');
  }

  return client.discovery(
    new URL(oidcSettings.authority),
    oidcSettings.clientId,
    oidcSettings.clientSecret
  );
}

export async function getOidcConfig() {
  if (!config) {
    config = await initOidc();
  }
  return config;
}
