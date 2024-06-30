import { DAppKitProvider } from "@vechain/dapp-kit-react";
import { ChakraProvider, Container, Flex } from "@chakra-ui/react";
import { InfoCard, Navbar, SubmissionModal } from "./components";
import { theme } from "./theme";
import { Box } from "@chakra-ui/react";
import { StartForm } from "./components/StartForm";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";
import { useWallet } from "@vechain/dapp-kit-react";
import { Status } from "./components/Status";

function App() {
  const transactions = useQuery(api.transactions.get);

  useEffect(() => {
    console.log(transactions);
  }, [transactions]);
  // const account = useWallet();
  // let ridingStatus = useQuery(api.transactions.getRidingFromWalletAddress, {
  //   walletAddress: account.account ?? "",
  // });

  // useEffect(() => {
  //   if (useWallet().account === null) {
  //     ridingStatus = false;
  //   }
  // });

  return (
    <>
      <Box bg="#000">
        <ChakraProvider theme={theme}>
          <DAppKitProvider
            usePersistence
            requireCertificate={false}
            genesis="test"
            nodeUrl="https://testnet.vechain.org/"
            logLevel={"DEBUG"}
          >
            <Navbar />
            <Flex flex={1} bg={"#000"}>
              <Container
                mt={{ base: 4, md: 10 }}
                maxW={"container.xl"}
                maxH={"full"}
                display={"flex"}
                flex={1}
                alignItems={"center"}
                justifyContent={"flex-start"}
                flexDirection={"column"}
                bg={"#000"}
              >
                <InfoCard />
                <StartForm />
              </Container>
            </Flex>

            {/* MODALS  */}
            <SubmissionModal />
          </DAppKitProvider>
        </ChakraProvider>
      </Box>
    </>
  );
}

export default App;
