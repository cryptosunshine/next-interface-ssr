import nookies, { parseCookies, setCookie, destroyCookie } from 'nookies';
import * as next from 'next';

export const KEY_USER_TOKEN = 'Authorization';

export const KEY_LOCALE = 'locale';

const isProductionMode = process.env.SERVICES_ENV === 'production';

const MAX_AGE = 60 * 60 * 24 * 365;

export type Context = next.NextPageContext | null | undefined;

export default class Storage {
  context?: Context;

  constructor(context?: Context) {
    this.context = context;
  }

  set = (key: string, value: string) => {
    if (this.context) {
      nookies.set(this.context, key, value, {
        maxAge: MAX_AGE,
        path: '/',
        sameSite: 'Strict',
        secure: true,
      });
    } else {
      setCookie(null, key, value, {
        maxAge: MAX_AGE,
        path: '/',
        sameSite: 'Strict',
        domain: window.location.hostname,
        secure: isProductionMode,
      });
    }
  };

  get = (key: string) => {
    if (this.context) {
      const cookies = nookies.get(this.context);
      return cookies[key];
    } else {
      const cookies = parseCookies();
      return cookies[key];
    }
  };

  remove = (key: string) => {
    if (this.context) {
      nookies.destroy(this.context, key);
    } else {
      destroyCookie(null, key, {
        path: '/',
        domain: window.location.hostname,
      });
    }
  };
}

export function isUserLogined(context?: Context): boolean {
  const storage = new Storage(context);
  return !!storage.get(KEY_USER_TOKEN);
}

export function userLoginOut(context?: Context) {
  const storage = new Storage(context);
  storage.remove(KEY_USER_TOKEN);
}
