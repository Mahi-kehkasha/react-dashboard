import { Box } from '@chakra-ui/react';

interface NotificationBadgeProps {
  count: number;
}

export const NotificationBadge = ({ count }: NotificationBadgeProps) => (
  <Box
    position="absolute"
    top="-1px"
    right="-1px"
    px={2}
    py={1}
    fontSize="xs"
    fontWeight="bold"
    lineHeight="none"
    color="white"
    transform="translate(50%, -50%)"
    bg="red.500"
    borderRadius="full"
  >
    {count}
  </Box>
);
