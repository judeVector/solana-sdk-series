import "dotenv/config";

import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers";
import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

const keypair = process.env.SECRET_KEY;
if (!keypair) {
  console.error("Please provide a keypair");
  process.exit(1);
}

const user = getKeypairFromEnvironment("SECRET_KEY");

const connection = new Connection(clusterApiUrl("devnet"));

console.log(
  `🔑 We've loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
);

const tokenAccount = new PublicKey("EX7PLA1GqbDxBoRihRKMAnEht6QKWM1dVAsn3fmu24sb");
const recipientAccount = new PublicKey("DMqnf3wnhGm2iaNEDhnutqcguDN1eGU8okK97Qp2ioBr");

const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  tokenAccount,
  recipientAccount
);

console.log(`✅ Token account created: ${associatedTokenAccount.address}`);

const transactionLink = getExplorerLink(
  "address",
  associatedTokenAccount.address.toString(),
  "devnet"
);

console.log(`✅ Transaction confirmed, explorer link is: ${transactionLink}`);
