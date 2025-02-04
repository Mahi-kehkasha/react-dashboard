import {
  Box,
  HStack,
  Link as ChakraLink,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

export const Navigation = () => {
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activeBg = useColorModeValue('blue.50', 'blue.900');

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      py={4}
      px={8}
    >
      <HStack spacing={8}>
        <ChakraLink
          as={RouterLink}
          to="/"
          px={4}
          py={2}
          rounded="md"
          bg={location.pathname === '/' ? activeBg : 'transparent'}
          _hover={{ bg: activeBg }}
        >
          Dashboard
        </ChakraLink>
        <ChakraLink
          as={RouterLink}
          to="/users"
          px={4}
          py={2}
          rounded="md"
          bg={location.pathname === '/users' ? activeBg : 'transparent'}
          _hover={{ bg: activeBg }}
        >
          Users
        </ChakraLink>
      </HStack>
    </Box>
  );
};
