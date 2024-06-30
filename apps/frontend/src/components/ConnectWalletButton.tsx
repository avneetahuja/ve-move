import { Button, Fade, HStack, Text } from "@chakra-ui/react";
import { useWallet, useWalletModal } from "@vechain/dapp-kit-react";
import { FaWallet } from "react-icons/fa6";
import { AddressIcon } from "./Icon";
import { humanAddress } from "@repo/utils/FormattingUtils";

export const ConnectWalletButton = () => {
  const { account } = useWallet();
  const { open } = useWalletModal();

  if (!account)
    return (
      <Fade in={true}>
        <Button
          onClick={open}
          colorScheme="primary"
          size="md"
          leftIcon={<FaWallet />}
          data-testid="connect-wallet"
        >
          Connect Wallet
        </Button>
      </Fade>
    );

  return (
    <Fade in={true}>
      <Button
        onClick={open}
        rounded={"full"}
        color="black"
        size="md"
        bg="E59400"
      >
        <HStack spacing={2}>
          <AddressIcon address={account} boxSize={4} rounded={"full"} />
          <Text fontWeight={"400"} color={"#FFF"}>{humanAddress(account, 4, 6)}</Text>
        </HStack>
      </Button>
    </Fade>
  );
};
