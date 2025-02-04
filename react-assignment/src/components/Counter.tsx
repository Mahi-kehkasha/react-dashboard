import {
  Box,
  Button,
  ButtonGroup,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  Progress,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const MotionBox = motion(Box);

export const Counter = () => {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const bgColor = useColorModeValue('blue.500', 'blue.200');
  const textColor = useColorModeValue('white', 'gray.800');
  const progressColor = useColorModeValue('blue.200', 'blue.600');

  const increment = () => {
    setCount((prev) => prev + 1);
    setIsAnimating(true);
  };

  const decrement = () => {
    setCount((prev) => Math.max(0, prev - 1));
    setIsAnimating(true);
  };

  const reset = () => {
    setCount(0);
    setIsAnimating(true);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  const getProgressValue = () => {
    return Math.min(100, count * 5); // 5% per count, max 100%
  };

  return (
    <VStack spacing={6} align="stretch" w="full">
      {/* Counter Display */}
      <Box position="relative" h="200px" overflow="hidden" borderRadius="lg">
        <MotionBox
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          bg={bgColor}
          initial={{ height: '20px' }}
          animate={{
            height: `${Math.max(40, Math.min(200, count * 20))}px`,
            scale: isAnimating ? 1.05 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        >
          <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            fontSize="4xl"
            fontWeight="bold"
            color={textColor}
            textShadow="0px 2px 4px rgba(0,0,0,0.2)"
          >
            {count}
          </Text>
        </MotionBox>
      </Box>

      {/* Progress Bar */}
      <Progress
        value={getProgressValue()}
        colorScheme="blue"
        height="4px"
        borderRadius="full"
        bg={progressColor}
        isAnimated
        hasStripe
      />

      {/* Controls */}
      <HStack spacing={4} justify="center">
        <ButtonGroup size="lg" variant="outline">
          <Button
            colorScheme="blue"
            onClick={decrement}
            isDisabled={count === 0}
            _hover={{ transform: 'scale(1.05)' }}
            transition="all 0.2s"
          >
            -
          </Button>
          <Button
            colorScheme="red"
            onClick={reset}
            isDisabled={count === 0}
            _hover={{ transform: 'scale(1.05)' }}
            transition="all 0.2s"
          >
            Reset
          </Button>
          <Button
            colorScheme="blue"
            onClick={increment}
            _hover={{ transform: 'scale(1.05)' }}
            transition="all 0.2s"
          >
            +
          </Button>
        </ButtonGroup>
      </HStack>

      {/* Stats */}
      <HStack justify="space-between" fontSize="sm" color="gray.500">
        <Text>Min: 0</Text>
        <Text>Current: {count}</Text>
        <Text>Progress: {getProgressValue()}%</Text>
      </HStack>
    </VStack>
  );
};
