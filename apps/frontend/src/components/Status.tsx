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
import { useWallet } from "@vechain/dapp-kit-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function Status({ walletAddress, setRideEnd }: { walletAddress: string; setRideEnd: (value: boolean) => void }) {
  const [error, setError] = useState(false);
  const [errorMessages, setErrorMessages] = useState("Error starting journey");
  const [seconds, setSeconds] = useState(0);
  //   const account = useWallet();
    const deleteWallet = useMutation(api.transactions.deleteWalletByAddress);
  const coordinates = useQuery(
    api.transactions.getCoordinatesFromWalletAddress,
    {
      walletAddress: walletAddress ?? "",
    }
  );

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

  function handleEnd() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log("Start Time: ", coordinates![2]);
          const data = {
            userAddress: walletAddress, // replace with actual wallet address
            sLatitude: coordinates![0],
            sLongitude: coordinates![1],
            eLatitude: position.coords.latitude.toString(),
            eLongitude: position.coords.longitude.toString(),
            sTime: coordinates![2],
            eTime: Date.now().toString(),
            modeOfTransport: 'ride', // replace with actual type
            rewardQty: '1' // replace with actual reward
          };
          const apiUrl = 'http://localhost:3001';
          fetch(`${apiUrl}/transaction`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch((error) => {
            console.error('Error:', error);
          });
            setRideEnd(false);
            deleteWallet({
              walletAddress: walletAddress,
            });
            
        },
        (error) => {
          setError(true);
          setErrorMessages("Error obtaining geolocation");
          console.error("Error obtaining geolocation", error);
        }
        
      );
    } else {
      setError(true);
      setErrorMessages("Geolocation is not supported by this browser.");
      console.error("Geolocation is not supported by this browser.");
    }
  }

  return (
    <Box
      w="350px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      textColor={"#FFF"}
    >
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
        <Button w="full" colorScheme={"primary"} onClick={handleEnd}>
          End
        </Button>
        {error && (
          <Text p={5} color="red.500">
            {errorMessages}
          </Text>
        )}
      </Box>
    </Box>
  );
}
