export const errorConstants: {
  [key: string]: {
    status: number;
    data: string;
  };
} = {
  UNKNOWN_ERROR: {
    status: 502,
    data: 'UNKNOWN_ERROR',
  },
  INVALID_TOKEN: {
    status: 502,
    data: 'INVALID_TOKEN',
  },
};

export const successConstants: {
  [key: string]: {
    status: number;
    data: string;
  };
} = {
  SUCCESSFULLY_SOMETHING: {
    status: 200,
    data: 'SUCCESSFULLY_SOMETHING',
  },
};
