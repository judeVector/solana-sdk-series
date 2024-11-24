import dotenv from "dotenv";
import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import { clusterApiUrl, Connection } from "@solana/web3.js";
import { createMint } from "@solana/spl-token";

dotenv.config();

const keypair = process.env.SECRET_KEY;
if (!keypair) {
  console.log("Please provide a keypair");
  console.log("❌ Failed!");
  process.exit();
}

const connection = new Connection(clusterApiUrl("devnet"));
const owner = getKeypairFromEnvironment("SECRET_KEY");

const token = await createMint(connection, owner, owner.publicKey, null, 2);
const link = getExplorerLink("address", token.toString(), "devnet");

console.log(`Done ✅! Token has been created ${link}`);
