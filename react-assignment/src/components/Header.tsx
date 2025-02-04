import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from '@chakra-ui/react';
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';

export const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('auth');
    navigate('/login');
  };

  return (
    <Box
      as="header"
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" h={16}>
          <Text
            fontSize="xl"
            fontWeight="bold"
            bgGradient="linear(to-r, brand.500, accent.500)"
            bgClip="text"
          >
            Dashboard
          </Text>

          <HStack spacing={4}>
            <IconButton
              aria-label={`Switch to ${
                colorMode === 'light' ? 'dark' : 'light'
              } mode`}
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
              onClick={toggleColorMode}
              variant="ghost"
              size="md"
            />

            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                size="md"
                px={2}
                borderRadius="full"
              >
                <HStack spacing={2}>
                  <Avatar size="sm" name={user?.name} src={user?.photoURL} />
                  <Text display={{ base: 'none', md: 'block' }}>
                    {user?.name}
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
