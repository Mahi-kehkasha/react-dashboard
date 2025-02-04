import { useState } from 'react';
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  useToast,
  Divider,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../store/authSlice';
import { FcGoogle } from 'react-icons/fc';
import { Icon } from '@chakra-ui/react';
import { GoogleSignInModal } from '../components/GoogleSignInModal';

const MotionBox = motion(Box);

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.200');

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      // Mock Google authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onOpen(); // Open email selection modal
    } catch {
      toast({
        title: 'Google Sign-In Failed',
        description: 'Please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleModalSubmit = (
    selectedEmail: string,
    displayName: string
  ) => {
    const user = {
      id: 'google_' + Date.now(),
      name: displayName,
      email: selectedEmail,
      photoURL: 'https://bit.ly/google-avatar',
    };

    dispatch(loginSuccess(user));
    localStorage.setItem('auth', JSON.stringify({ user }));

    toast({
      title: 'Google Sign-In Successful',
      description: `Welcome ${displayName}!`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });

    setIsGoogleLoading(false);
    navigate('/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (email && password) {
        const user = {
          id: '1',
          name: email,
          email: email,
          photoURL: 'https://bit.ly/default-avatar',
        };

        dispatch(loginSuccess(user));
        localStorage.setItem('auth', JSON.stringify({ user }));

        toast({
          title: 'Login successful',
          description: `Welcome ${email}!`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        navigate('/dashboard');
      }
    } catch {
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      w="100vw"
      bg={useColorModeValue('gray.50', 'gray.900')}
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
    >
      <Container maxW="lg" px={{ base: '4', sm: '8' }} py={0}>
        <Center h="full">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            w="full"
            maxW="md"
          >
            <Box
              bg={bgColor}
              py="8"
              px={{ base: '4', md: '10' }}
              shadow="2xl"
              rounded={{ sm: 'lg' }}
              maxH="calc(100vh - 32px)"
              overflow="auto"
              mx={4}
            >
              <VStack spacing="6">
                <Heading
                  size="xl"
                  fontWeight="extrabold"
                  bgGradient="linear(to-r, brand.500, accent.500)"
                  bgClip="text"
                >
                  Welcome Back
                </Heading>
                <Text fontSize="md" color={textColor}>
                  Sign in to your account
                </Text>
              </VStack>

              <Button
                w="full"
                mt="8"
                size="lg"
                leftIcon={<Icon as={FcGoogle} boxSize="5" />}
                onClick={handleGoogleSignIn}
                isLoading={isGoogleLoading}
                variant="outline"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
                transition="all 0.2s"
              >
                Continue with Google
              </Button>

              <HStack my="6">
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color={textColor}>
                  or sign in with email
                </Text>
                <Divider />
              </HStack>

              <Stack as="form" spacing="6" onSubmit={handleLogin}>
                <FormControl id="email" isRequired>
                  <FormLabel>Email address</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    size="lg"
                    borderRadius="md"
                  />
                </FormControl>

                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    size="lg"
                    borderRadius="md"
                  />
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="brand"
                  size="lg"
                  fontSize="md"
                  isLoading={isLoading}
                  w="full"
                  mt="6"
                  bgGradient="linear(to-r, brand.500, accent.500)"
                  _hover={{
                    bgGradient: 'linear(to-r, brand.600, accent.600)',
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  transition="all 0.2s"
                >
                  Sign in
                </Button>

                <HStack justify="center" spacing="1">
                  <Text fontSize="sm" color={textColor}>
                    Don't have an account?
                  </Text>
                  <Button
                    variant="link"
                    colorScheme="brand"
                    size="sm"
                    onClick={() => navigate('/signup')}
                  >
                    Sign up
                  </Button>
                </HStack>
              </Stack>
            </Box>
          </MotionBox>
        </Center>
      </Container>

      <GoogleSignInModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleGoogleModalSubmit}
      />
    </Box>
  );
};
