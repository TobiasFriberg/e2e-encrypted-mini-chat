export const lightTheme = {
  colors: {
    primary: '#1976D2',
    primaryLight: '#BBDEFB',
    secondary: '#FF6F00',
    alternative: '#00796B',
    linkColor: '#6A1B9A',
    textColorDark: '#303030',
    textColorLight: '#fafafa',
    backgroundColor: '#faf9f9',
    grayLightEvenMore: '#eeeeee',
    grayLightMore: '#e0e0e0',
    grayLight: '#bdbdbd',
    gray: '#9E9E9E',
    grayDark: '#757575',
    grayDarkMore: '#424242',
    grayDarkEvenMore: '#212121',
    notificationError: '#db3a34',
    notificationWarning: '#f7b801',
    notificationInfo: '#1a659e',
    notificationSuccess: '#6a994e',
  },
  roundness: '8px',
  buttonRoundness: '25px',
  inputRoundness: '8px',
  fontSize: '16px',
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#1565C0',
    primaryLight: '#BBDEFB',
    secondary: '#E65100',
    alternative: '#00796B',
    backgroundColor: '#263238',
  },
};
