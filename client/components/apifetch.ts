import { Options } from '../interface/api';

const RETRIES = 2;

function ApiFetch(apiOptions: Options, tryCount: number = 0): Promise<object> {
  const csrfToken: string | null = window.localStorage.getItem('token');

  const defaultOptions: Options = {
    url: '',
    method: 'GET',
    body: null,
    version: '1',
  };

  let options: Options = { ...defaultOptions, ...apiOptions };
  const fileUpload = options.body instanceof FormData;

  let fetchOptions: any = {
    method: options.method,
    body: JSON.stringify(options.body),
  };

  if (!options.body) {
    fetchOptions.headers = new Headers({ 'content-type': 'text/plain' });
    delete fetchOptions.body;
  } else {
    if (!fileUpload) {
      fetchOptions.headers = new Headers({ 'content-type': 'application/json' });
    } else {
      fetchOptions = apiOptions;
      fetchOptions.headers = new Headers({});
    }
  }

  if (csrfToken) {
    fetchOptions.headers.set('x-csrf', csrfToken);
  }

  fetchOptions.headers.set('accept-version', options.version);

  const url = options.url || '';

  return fetch(`${__BFF_ADDRESS}${url}`, fetchOptions)
    .then((response) => {
      if (!response.ok && response.status === 401) {
        if (tryCount < RETRIES) {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(ApiFetch(options, tryCount + 1));
            }, 600 * (tryCount + 1));
          });
        }
      }

      const contentType = response.headers.get('content-type');
      let responder;
      if (contentType && contentType.indexOf('application/json') !== -1) {
        responder = () => response.json();
      } else {
        responder = () => response.text();
      }
      if (!response.ok) {
        return responder();
      }
      if (response.status === 204) {
        return {};
      }
      return responder();
    })
    .then((response: { ok?: boolean }) => {
      if (!response.ok) {
        throw response;
      }
      return response;
    })
    .catch((e) => {
      throw e;
    });
}

export default ApiFetch;
