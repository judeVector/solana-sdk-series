import dotenv from "dotenv";

import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

dotenv.config();

const keypair = process.env.SECRET_KEY;
if (!keypair) {
  console.log("Please provide a keypair");
  console.log("❌ Failed!");
  process.exit();
}

const connection = new Connection(clusterApiUrl("devnet"));
const address = getKeypairFromEnvironment("SECRET_KEY").publicKey;
const balance = await connection.getBalance(address);
const solBalance = balance / LAMPORTS_PER_SOL;
console.log(`The balance of this address: ${address} is ${solBalance} SOL`);
console.log("✅ Done!");
