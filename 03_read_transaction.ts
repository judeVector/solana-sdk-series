import dotenv from "dotenv";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

dotenv.config();

const keypair = process.env.SECRET_KEY;
if (!keypair) {
  console.error("Please provide a keypair");
  process.exit(1);
}

const connection = new Connection(clusterApiUrl("devnet"));
const senderAddress = getKeypairFromEnvironment("SECRET_KEY");
const receiverAddress = getKeypairFromEnvironment("RECEIVER").publicKey;

const amount = 1.5;

const transaction = new Transaction();
const transferInstruction = SystemProgram.transfer({
  fromPubkey: senderAddress.publicKey,
  toPubkey: receiverAddress,
  lamports: amount * LAMPORTS_PER_SOL,
});

transaction.add(transferInstruction);

try {
  const signature = await sendAndConfirmTransaction(connection, transaction, [senderAddress]);
  console.log(`Transaction successful! ${amount} SOL sent to ${receiverAddress}`);
  console.log(`Transaction signature: ${signature}`);
} catch (error) {
  console.error("Transaction failed:", error);
}
