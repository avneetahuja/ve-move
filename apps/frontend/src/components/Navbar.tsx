import { Box, Container, HStack, Image } from "@chakra-ui/react";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { Text } from "@chakra-ui/react";
export const Navbar = () => {
  return (
    <Box
      px={0}
      position={"sticky"}
      top={0}
      zIndex={10}
      py={4}
      h={"auto"}
      w={"full"}
      bg={"#000"}
    >
      <Container
        w="full"
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems={"center"}
        maxW={"container.xl"}
      >
        <HStack alignSelf={{ base: "center", md: "flex-start" }}>
              <Image src="/logo.jpg" h={8} borderRadius={10} />
              <Text fontSize={24} fontWeight={800} color={"#FFF"}>
                VeMove
              </Text>
            </HStack>

        <HStack flex={1} spacing={4} justifyContent={"end"}>
          <ConnectWalletButton />
        </HStack>
      </Container>
    </Box>
  );
};
