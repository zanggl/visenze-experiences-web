const {nextui} = require('@nextui-org/theme');

const getFontObj = (configName) => {
  const deviceTypes = ['mobile', 'tablet', 'desktop'];
  const targetElements = ['widgetTitle', 'callsToActionText', 'productCardTitle', 'productCardPrice', 'searchBarText'];
  const fontSizeObj = {};

  deviceTypes.forEach(deviceType => {
    targetElements.forEach(targetElement => {
      fontSizeObj[`${deviceType}-${targetElement}`] = `var(--widget-${deviceType}-${targetElement}-${configName})`;
    });
  });

  return fontSizeObj;
};

const getColourObj = (configName) => {
  const colourNames = ['primary', 'buttonPrimary', 'buttonSecondary'];
  const colourObj = {};

  colourNames.forEach(colourName => {
    colourObj[`${colourName}`] = `var(--widget-${configName}-${colourName})`;
  });

  return colourObj;
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/components/(button|card|chip|image|input|listbox|spacer|skeleton).js',
  ],
  theme: {
    extend: {
      textColor: getColourObj('text'),
      backgroundColor: getColourObj('background'),
      fontSize: getFontObj('fontSize'),
      fontWeight: getFontObj('fontWeight'),
      height: {
        108: '27rem',
      },
      spacing: {
        '19/20': '95%',
        '9/10': '90%',
        '7/10': '70%',
        '13/20': '65%',
        '11/20': '55%',
        '7/20': '35%',
        '3/10': '30%',
        '1/5': '20%',
        '3/20': '15%',
        '1/8': '12.5%',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
};
