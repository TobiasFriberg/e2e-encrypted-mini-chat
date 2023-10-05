export interface HeadersType {
  [key: string]: string;
}

export interface Options {
  headers?: Headers;
  url?: string;
  method: string;
  body?: string | null | FormData | object;
  version?: string | null;
}
