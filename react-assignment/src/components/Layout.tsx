import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  useColorMode,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Link,
  Text,
  Badge,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { FiMoon, FiSun, FiUser, FiUsers, FiLogOut } from 'react-icons/fi';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { logout } from '../store/authSlice';
import { useState, useEffect } from 'react';

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  photoURL?: string;
}

interface UserStats {
  total: number;
  active: number;
  lastUpdated: string;
}

export const Layout = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    active: 0,
    lastUpdated: new Date().toLocaleString(),
  });

  useEffect(() => {
    const updateUserStats = () => {
      const allUsersStr = localStorage.getItem('allUsers');
      if (allUsersStr) {
        const allUsers = JSON.parse(allUsersStr) as UserData[];
        setUserStats({
          total: allUsers.length,
          active: allUsers.filter((user) => user.isActive).length,
          lastUpdated: new Date().toLocaleString(),
        });
      }
    };

    updateUserStats();
    const interval = setInterval(updateUserStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Box
        as="header"
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        position="fixed"
        w="full"
        zIndex={10}
      >
        <Container maxW="container.xl">
          <Flex justify="space-between" align="center" h={16}>
            <VStack spacing={1} align="start">
              <Link as={RouterLink} to="/" fontWeight="bold">
                Dashboard
              </Link>
              <Link
                as={RouterLink}
                to="/users"
                display="flex"
                alignItems="center"
                fontSize="sm"
                color="gray.600"
                _hover={{ color: 'blue.500' }}
              >
                <HStack spacing={2}>
                  <FiUsers size={14} />
                  <Text>User Management</Text>
                </HStack>
              </Link>
            </VStack>

            {/* User Statistics */}
            <HStack spacing={6}>
              <Tooltip label="Total registered users" hasArrow>
                <HStack>
                  <Text fontSize="sm" color="gray.500">
                    Total:
                  </Text>
                  <Badge colorScheme="blue" fontSize="sm">
                    {userStats.total}
                  </Badge>
                </HStack>
              </Tooltip>

              <Tooltip label="Currently active users" hasArrow>
                <HStack>
                  <Text fontSize="sm" color="gray.500">
                    Active:
                  </Text>
                  <Badge colorScheme="green" fontSize="sm">
                    {userStats.active}
                  </Badge>
                </HStack>
              </Tooltip>

              <Tooltip
                label={`Last updated: ${userStats.lastUpdated}`}
                hasArrow
              >
                <Text fontSize="xs" color="gray.500">
                  Updated {new Date(userStats.lastUpdated).toLocaleTimeString()}
                </Text>
              </Tooltip>
            </HStack>

            <HStack spacing={4}>
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
                onClick={toggleColorMode}
                variant="ghost"
                size="sm"
              />

              <Menu>
                <MenuButton>
                  <Avatar size="sm" name={user?.name} src={user?.photoURL} />
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<FiUser />}>Profile</MenuItem>
                  <Divider />
                  <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Container>
      </Box>

      <Box as="main" pt="64px">
        <Container maxW="container.xl" py={8}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};
