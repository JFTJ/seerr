import { initOidc } from '@server/lib/oidc';
import type { OidcSettings } from '@server/lib/settings';
import { getSettings } from '@server/lib/settings';
import crypto from 'crypto';
import { Router } from 'express';

const oidcRoutes = Router();

oidcRoutes.get('/', async (req, res) => {
  const settings = getSettings();
  const oidcConfig = settings.oidc;

  return res.status(200).json(getSafeConfig(oidcConfig));
});

oidcRoutes.post('/', async (req, res, next) => {
  const settings = getSettings();
  const body = req.body as OidcSettings;

  try {
    settings.oidc = {
      enabled: body.enabled ?? false,
      authority: body.authority,
      clientId: body.clientId,
      clientSecret: body.clientSecret,
      redirectUri: body.redirectUri,
      scope: body.scope || 'openid profile',
    };

    await settings.save();
    // Re-initialize OIDC with the new settings
    initOidc();

    return res.status(201).json(getSafeConfig(settings.oidc));
  } catch (e) {
    return next({
      status: 500,
      message: 'Failed to create OIDC configuration',
    });
  }
});

function getSafeConfig(oidcConfig: OidcSettings) {
  const clientSecretSHA256 = oidcConfig.clientSecret
    ? crypto.createHash('sha256').update(oidcConfig.clientSecret).digest('hex')
    : '';

  return {
    enabled: oidcConfig.enabled,
    authority: oidcConfig.authority,
    clientId: oidcConfig.clientId,
    clientSecretSHA256,
    redirectUri: oidcConfig.redirectUri,
    scope: oidcConfig.scope,
  };
}

export default oidcRoutes;
