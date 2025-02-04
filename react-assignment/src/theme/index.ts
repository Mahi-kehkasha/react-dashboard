import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#e6f6ff',
      100: '#b3e0ff',
      200: '#80cbff',
      300: '#4db5ff',
      400: '#1a9fff',
      500: '#0088ff',
      600: '#006dcc',
      700: '#005299',
      800: '#003666',
      900: '#001b33',
    },
    accent: {
      50: '#f5f3ff',
      100: '#e9e4ff',
      200: '#d3c9ff',
      300: '#b39dff',
      400: '#9371ff',
      500: '#7445ff',
      600: '#5a1fff',
      700: '#4400ff',
      800: '#3600cc',
      900: '#280099',
    },
  },
  components: {
    Button: {
      baseStyle: {
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        _active: {
          transform: 'translateY(0)',
        },
        transition: 'all 0.2s',
      },
    },
    Card: {
      baseStyle: {
        container: {
          transition: 'all 0.2s',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: 'xl',
          },
        },
      },
    },
  },
  styles: {
    global: {
      'html, body': {
        scrollBehavior: 'smooth',
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
});

export default theme;
