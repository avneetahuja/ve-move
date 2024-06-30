import { TransactionHandler, clauseBuilder, unitsUtils } from "@vechain/sdk-core";
import { ProviderInternalBaseWallet, ThorClient, VeChainProvider, signerUtils } from "@vechain/sdk-network";
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

interface TransactionResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}

export async function performTransaction(userAddress: string, rewardQty: string): Promise<TransactionResult> {
    try {

        console.log('Performing transaction for user:', userAddress, 'with reward:', rewardQty);

        // 1 - Create the thor client
        const _testnetUrl = 'https://testnet.vecha.in/';
        const thorClient = ThorClient.fromUrl(_testnetUrl, {
            isPollingEnabled: false
        });

        const privateKey = process.env.SENDER_PRIVATE_KEY || '';
        const address = process.env.SENDER_ADDRESS || '';

        // Create the provider
        const provider = new VeChainProvider(
            thorClient,
            new ProviderInternalBaseWallet([
                {
                    privateKey: Buffer.from(privateKey, 'hex'),
                    address: address
                }
            ]),
            false
        );

        // 2 - Create the transaction clauses
        const transaction = {
            clauses: [
                clauseBuilder.transferVET(
                    userAddress,
                    unitsUtils.parseVET(rewardQty)
                )
            ],
            simulateTransactionOptions: {
                caller: address
            }
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
            signerUtils.transactionBodyToTransactionRequestInput(
                txBody,
                address
            )
        );

        const signedTransaction = TransactionHandler.decode(
            Buffer.from(rawSignedTransaction.slice(2), 'hex'),
            true
        );

        // 6 - Send the transaction
        const sendTransactionResult = await thorClient.transactions.sendTransaction(signedTransaction);

        // 7 - Wait for transaction receipt
        const txReceipt = await thorClient.transactions.waitForTransaction(
            sendTransactionResult.id
        );

        console.log('Transaction receipt:', txReceipt);
        return { success: true, transactionId: sendTransactionResult.id };
    } catch (error) {
        console.error('Error executing transaction:', error);
        // Return error result
        return { success: false, error: (error instanceof Error) ? error.message : 'Unknown error' };
    }
}
