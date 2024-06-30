import {
  Box,
  Button,
  Text,
  Select,
  VStack,
  HStack,
  useEventListenerMap,
} from "@chakra-ui/react";
import { useWallet } from "@vechain/dapp-kit-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { Status } from "./Status";

export function StartForm() {
  // const transactions = useQuery(api.transactions.get);
  const createTransaction = useMutation(api.transactions.updateTransaction);
  const [rideType, setRideType] = useState("transit");
  const [error, setError] = useState(false);
  const [errorMessages, setErrorMessages] = useState("Error starting journey");
  const account = useWallet();
  let ridingStatus =
    useQuery(api.transactions.getRidingFromWalletAddress, {
      walletAddress: account.account ?? "",
    }) ?? false;
  function enterTransaction() {
    if (!account.account) {
      setError(true);
      setErrorMessages("Please connect your wallet");
      return;
    }
    if (ridingStatus === true) {
      setError(true);
      setErrorMessages("You are already riding");
      return;
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          createTransaction({
            walletAddress: account.account ?? " ",
            riding: true,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
            time: Date.now().toString(),
            rideType: rideType,
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

  useEffect(() => {
    if (!account.account) {
      ridingStatus = false;
    }
  }, [account.account]);

  if (ridingStatus === true) {
    return <Status walletAddress={account.account ?? ""} />;
  } else {
    return (
      <Box
        w="350px"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        textColor={"white"}
      >
        <VStack align="start" p={5}>
          <Text fontSize="2xl" fontWeight="bold">
            Start Journey
          </Text>
          <Text fontSize="md" color="gray.500">
            Are you ready to start your journey?
          </Text>
          <form>
            <VStack align="start" spacing={4}>
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">Start Location:</Text>
                <Text fontSize="2xl" borderBottom="4px solid orange">
                  Bus Station
                </Text>
              </VStack>
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">Journey Type</Text>
                <Select
                  placeholder="Select"
                  value={rideType}
                  onChange={(e) => setRideType(e.target.value)}
                >
                  <option value="transit">🚍🚝 Transit</option>
                  <option value="hike">🗻👣 Hike</option>
                  <option value="bike">🚴‍♂️ Bike</option>
                </Select>
              </VStack>
            </VStack>
          </form>
          <Box id="qr-scanner" display="none" w="100%"></Box>
        </VStack>
        <Box p={5} borderTopWidth="1px">
          <Button w="full" colorScheme="primary" onClick={enterTransaction}>
            Start
          </Button>
        </Box>
        {error && (
          <Text p={5} color="red.500">
            {errorMessages}
          </Text>
        )}
      </Box>
    );
  }
}
