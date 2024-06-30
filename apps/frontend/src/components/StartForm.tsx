import { Box, Button, Text, Select, VStack, HStack } from "@chakra-ui/react";

export function StartForm() {
  return (
    <Box w="350px" borderWidth="1px" borderRadius="lg" overflow="hidden" textColor={"white"}>
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
              <Select placeholder="Select">
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
        <Button w="full" colorScheme="primary">Start</Button>
      </Box>
    </Box>
  );
}