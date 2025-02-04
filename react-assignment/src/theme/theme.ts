import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  colors: {
    brand: {
      50: '#E6F6FF',
      100: '#BAE3FF',
      200: '#7CC4FA',
      300: '#47A3F3',
      400: '#2186EB',
      500: '#0967D2',
      600: '#0552B5',
      700: '#03449E',
      800: '#01337D',
      900: '#002159',
    },
    accent: {
      50: '#FFE3EC',
      100: '#FFB8D2',
      200: '#FF8CBA',
      300: '#F364A2',
      400: '#E8368F',
      500: '#DA127D',
      600: '#BC0A6F',
      700: '#A30664',
      800: '#870557',
      900: '#620042',
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'lg',
        _hover: {
          transform: 'translateY(-2px)',
          boxShadow: 'lg',
        },
        _active: {
          transform: 'translateY(0)',
        },
        transition: 'all 0.2s',
      },
      variants: {
        solid: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        outline: {
          borderWidth: '2px',
        },
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: 'bold',
        letterSpacing: 'tight',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'xl',
          bg: 'white',
          overflow: 'hidden',
          transition: 'all 0.2s',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: '2xl',
          },
        },
      },
    },
  },
  fonts: {
    heading: '"Inter", sans-serif',
    body: '"Inter", sans-serif',
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme;
