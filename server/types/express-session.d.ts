import 'express-session';

// Declaration merging to apply our own types to SessionData
// See: (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-session/index.d.ts#L23)
declare module 'express-session' {
  interface SessionData {
    userId: number;
    oidc?: {
      code_verifier: string;
      state: string;
      nonce: string;
      returnTo: string;
    };
  }
}
