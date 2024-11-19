require("dotenv").config();
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

const keypair = process.env.KEYPAIR;
if (!keypair) {
  console.log("Please provide a keypair");
  console.log("❌ Failed!");
  process.exit();
}

const connection = new Connection(clusterApiUrl("devnet"));
const address = getKeypairFromEnvironment("KEYPAIR").publicKey;
const balance = await connection.getBalance(address);
const solBalance = balance / LAMPORTS_PER_SOL;
console.log(`The balance of this address: ${address} is ${solBalance} SOL`);
console.log("✅ Done!");
