import {
  TransactionHandler,
  clauseBuilder,
  unitsUtils,
} from "@vechain/sdk-core";
import {
  ProviderInternalBaseWallet,
  ThorClient,
  VeChainProvider,
  signerUtils,
} from "@vechain/sdk-network";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

interface TransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export async function performTransaction(
  userAddress: string,
  rewardQty: string
): Promise<TransactionResult> {
  try {
    console.log(
      "Performing transaction for user:",
      userAddress,
      "with reward:",
      rewardQty
    );

    // 1 - Create the thor client
    const _testnetUrl = "https://testnet.vecha.in/";
    const thorClient = ThorClient.fromUrl(_testnetUrl, {
      isPollingEnabled: false,
    });

    const privateKey = process.env.SENDER_PRIVATE_KEY || "";
    const address = process.env.SENDER_ADDRESS || "";
    console.log("Sender address:", address);
    console.log("Sender private key:", privateKey);
    // Create the provider
    const provider = new VeChainProvider(
      thorClient,
      new ProviderInternalBaseWallet([
        {
          privateKey: Buffer.from(privateKey, "hex"),
          address: address,
        },
      ]),
      false
    );

    // 2 - Create the transaction clauses
    const transaction = {
      clauses: [
        clauseBuilder.transferVET(userAddress, unitsUtils.parseVET(rewardQty)),
      ],
      simulateTransactionOptions: {
        caller: address,
      },
    };

    // 3 - Estimate gas
    const gasResult = await thorClient.gas.estimateGas(
      transaction.clauses,
      address
    );

    // 4 - Build transaction body
    const txBody = await thorClient.transactions.buildTransactionBody(
      transaction.clauses,
      gasResult.totalGas
    );

    // 5 - Sign the transaction
    const signer = await provider.getSigner(address);
    const rawSignedTransaction = await signer!.signTransaction(
      signerUtils.transactionBodyToTransactionRequestInput(txBody, address)
    );

    const signedTransaction = TransactionHandler.decode(
      Buffer.from(rawSignedTransaction.slice(2), "hex"),
      true
    );

    // 6 - Send the transaction
    const sendTransactionResult =
      await thorClient.transactions.sendTransaction(signedTransaction);

    // 7 - Wait for transaction receipt
    const txReceipt = await thorClient.transactions.waitForTransaction(
      sendTransactionResult.id
    );

    console.log("Transaction receipt:", txReceipt);
    return { success: true, transactionId: sendTransactionResult.id };
  } catch (error) {
    console.error("Error executing transaction:", error);
    // Return error result
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Function to calculate the time difference in seconds between two UNIX timestamps
function calculateTimeDifferenceInSeconds(
  startTimeUnix: number,
  endTimeUnix: number
): number {
  return Math.abs(endTimeUnix - startTimeUnix) / 1000;
}

// Function to fetch travel duration from Google Maps Directions API
async function fetchTravelDuration(
  sLatitude: string,
  sLongitude: string,
  eLatitude: string,
  eLongitude: string,
  modeOfTransport: string
): Promise<number | null> {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY || "";
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${sLatitude},${sLongitude}&destination=${eLatitude},${eLongitude}&mode=${modeOfTransport}&departure_time=now&key=${apiKey}`;

    const response = await axios.get(url);
    console.log(
      "Google Maps API response:",
      response.data.routes[0].legs[0].duration.value
    );
    const durationInSeconds = response.data.routes[0].legs[0].duration.value; // Duration in seconds
    return durationInSeconds;
  } catch (error) {
    console.error(
      "Error fetching travel duration from Google Maps API:",
      error
    );
    return null;
  }
}

// DAO_VERIFY function implementation
export async function DAO_VERIFY(
  sLatitude: string,
  sLongitude: string,
  eLatitude: string,
  eLongitude: string,
  sTimeUnix: number,
  eTimeUnix: number,
  modeOfTransport: string
): Promise<boolean> {
  try {
    console.log("DAO_VERIFY called with:", {
      sLatitude,
      sLongitude,
      eLatitude,
      eLongitude,
      sTimeUnix,
      eTimeUnix,
      modeOfTransport,
    });
    // Step 1: Calculate time duration between sTime and eTime
    const estimatedTimeInSeconds = calculateTimeDifferenceInSeconds(
      sTimeUnix,
      eTimeUnix
    );
    
    console.log("Estimated time:", estimatedTimeInSeconds);
    if (estimatedTimeInSeconds < 120.0) {
        return false;
      }
    // Step 2: Fetch travel duration from Google Maps API

    const travelDuration = await fetchTravelDuration(
      sLatitude,
      sLongitude,
      eLatitude,
      eLongitude,
      modeOfTransport
    );
    console.log("Travel duration:", travelDuration);

    // Step 3: Compare travel duration with estimated time with a tolerance of +-600 seconds (10 minutes)
    const toleranceInSeconds = 90; // 1.5 minutes tolerance
    const difference = Math.abs(
      travelDuration ?? 1500 - estimatedTimeInSeconds
    );
    console.log("Difference:", difference);
    if (difference <= toleranceInSeconds) {
      return true; // Within tolerance
    } else {
      return false; // Outside tolerance
    }
  } catch (error) {
    console.error("Error in DAO_VERIFY:", error);
    return false;
  }
}
