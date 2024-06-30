import { Box, Button, Text, Select, VStack } from "@chakra-ui/react";
import { useWallet } from "@vechain/dapp-kit-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect, useState } from "react";
import { Status } from "./Status";

export function StartForm() {
  const createTransaction = useMutation(api.transactions.updateTransaction);
  const [rideType, setRideType] = useState("transit");
  const [locationText, setLocationText] = useState("Bus Station/Train Station");
  const [error, setError] = useState(false);
  const [errorMessages, setErrorMessages] = useState("Error starting journey");
  const [loading, setLoading] = useState(false);
  const account = useWallet();
  const [rideEnd, setRideEnd] = useState(true);
  let ridingStatus =
    useQuery(api.transactions.getRidingFromWalletAddress, {
      walletAddress: account.account ?? "",
    }) ?? false;

  function enterTransaction() {
    setLoading(true);
    if (!account.account) {
      setError(true);
      setErrorMessages("Please connect your wallet");
      setLoading(false);
      return;
    }
    if (ridingStatus === true) {
      setError(true);
      setErrorMessages("You are already riding");
      setLoading(false);
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
          }).then(() => {
            setLoading(false);
            setRideEnd(true);
          }).catch((error) => {
            setError(true);
            setErrorMessages("Error starting transaction");
            console.error("Error starting transaction", error);
            setLoading(false);
          });
        },
        (error) => {
          setError(true);
          setErrorMessages("Error obtaining geolocation");
          console.error("Error obtaining geolocation", error);
          setLoading(false);
        }
      );
    } else {
      setError(true);
      setErrorMessages("Geolocation is not supported by this browser.");
      console.error("Geolocation is not supported by this browser.");
      setLoading(false);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setRideType(event.target.value);
  }

  useEffect(() => {
    if (rideType === "transit") {
      setLocationText("Bus Station/Train Station");
    } else if (rideType === "hike") {
      setLocationText("Mountain/Hill");
    } else {
      setLocationText("Bike Station");
    }
  }, [rideType]);

  useEffect(() => {
    if (!account.account) {
      ridingStatus = false;
    }
    if (account.account && errorMessages === "Please connect your wallet") {
      setError(false);
      setErrorMessages("Error starting journey");
    }
  }, [account.account]);

  if (ridingStatus === true && rideEnd === true) {
    return (
      <Status walletAddress={account.account ?? ""} setRideEnd={setRideEnd} />
    );
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
                <Text
                  fontSize="2xl"
                  borderBottom="4px solid"
                  borderColor={"orange.600"}
                >
                  {locationText}
                </Text>
              </VStack>
              <VStack align="start" spacing={1}>
                <Text fontWeight="bold">Journey Type</Text>
                <Select
                  placeholder="Select"
                  value={rideType}
                  onChange={(e) => handleChange(e)}
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
          <Button
            w="full"
            colorScheme="primary"
            onClick={enterTransaction}
            isLoading={loading}
            loadingText="Starting"
          >
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
