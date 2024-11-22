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

const main = async () => {
  const keypair = process.env.KEYPAIR;
  if (!keypair) {
    console.log("Please provide a keypair");
    console.log("❌ Failed!");
    process.exit();
  }

  const connection = new Connection(clusterApiUrl("devnet"));
  const senderAddress = getKeypairFromEnvironment("KEYPAIR");
  const receiverAddress = getKeypairFromEnvironment("RECEIVER").publicKey;

  const amount = 1.5 * LAMPORTS_PER_SOL;

  const transaction = new Transaction();
  const transferInstruction = SystemProgram.transfer({
    fromPubkey: senderAddress.publicKey,
    toPubkey: receiverAddress,
    lamports: amount,
  });

  transaction.add(transferInstruction);
  const signature = await sendAndConfirmTransaction(connection, transaction, [senderAddress]);

  console.log(`Tx successful, ${amount} SOL sent to ${receiverAddress}`);
  console.log(`Transaction signature is ${signature} ✅ Done!`);
};

main().catch(console.error);
