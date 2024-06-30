import { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

export function Status() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  return (
    <Box w="350px" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Box p="6">
        <Heading size="md">Status</Heading>
        <Text mt="1">You're so close to earn yourself some VeChain!</Text>
      </Box>
      <Box p="6">
        <VStack spacing="24px">
          <FormControl id="ride-status">
            <FormLabel>Ride Status:</FormLabel>
            <Text fontSize="2xl" borderBottom="4px" borderColor="orange.600">
              Ongoing!
            </Text>
          </FormControl>
          <FormControl id="time-elapsed">
            <FormLabel>Time Elapsed:</FormLabel>
            <Text fontSize="2xl">{formatTime(seconds)}</Text>
          </FormControl>
        </VStack>
      </Box>
      <Box p="6">
        <Button w="full">End</Button>
      </Box>
    </Box>
  );
}