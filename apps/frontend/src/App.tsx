import { DAppKitProvider } from "@vechain/dapp-kit-react";
import { ChakraProvider, Container, Flex } from "@chakra-ui/react";
import { InfoCard, Navbar, SubmissionModal } from "./components";
import { theme } from "./theme";
import { Button } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { StartForm } from "./components/StartForm";

function App() {
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
