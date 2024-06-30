import {
  Box,
  Card,
  HStack,
  Image,
  VStack,
  Text,
  Button,
  Flex,
  Link,
} from "@chakra-ui/react";

export const InfoCard = () => {
  return (
    <Card w={"full"} bg={"#000"}>
      <Box p={3}>
        <VStack w={"full"} spacing={{ base: 2, md: 4 }}>
          <Image src="/cover.jpg" borderRadius={16} />
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            direction={{ base: "column", md: "row" }}
            alignItems={"center"}
          >
            {/* <HStack alignSelf={{ base: "center", md: "flex-start" }}>
              <Image src="/logo.png" h={16} borderRadius={16} />
              <Text fontSize={24} fontWeight={800} color={"#FFF"}>
                VeMove
              </Text>
            </HStack> */}
            <Flex
              mt={{ base: 4, md: 0 }}
              direction={{ base: "column", md: "row" }}
            >
            </Flex>
          </Flex>
        </VStack>
      </Box>
    </Card>
  );
};
