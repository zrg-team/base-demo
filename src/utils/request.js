import secureStorage from '@shared/secure-store';
import { USER_JWT } from '@constants/index';

export const request = async (...args) => {
  let res;
  try {
    res = await fetch(...args);
    const json = await res.json();
    // Hack to response JSON
    res.json = async () => json;

    return res;
  } catch (err) {
    // TODO handle fail request due to response is not JSON, fake the message
    return {
      status: res ? res.status : 500,
      json: async () => ({
        success: false,
        error_message: 'ERROR_MESSAGE',
        error: err.message,
      }),
      headers: {
        get: () => null,
      },
    };
  }
};

export const requestAuthentication = async (url, options = {}) => {
  const token = await secureStorage.getValue(USER_JWT);
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    Accept: 'application/json',
    ...options.headers,
  };
  const res = await request(url, {
    ...options,
    headers,
  });

  return res;
};
