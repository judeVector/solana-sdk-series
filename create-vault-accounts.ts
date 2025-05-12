import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import dotenv from "dotenv";
const { Connection, Keypair, PublicKey, SystemProgram, Transaction } = require("@solana/web3.js");
const {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} = require("@solana/spl-token");
dotenv.config();

// Connection to Solana devnet (change to mainnet-beta for production)
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Load your admin wallet (replace with your keypair file or use a wallet provider)
const adminKeypair = getKeypairFromEnvironment("SECRET_KEY");

// Program ID from your smart contract
const programId = new PublicKey("BRFoxH9zLTYvEXZBDfKWmwfEaSGV2xTtfqAEK47YsVUt");

// Mint addresses for USDT and USDC (devnet or mainnet)
const mints = {
  USDT: new PublicKey("EJwZgeZrdC8TXTQbQBoL6bfuAnFUUy1PVCMB4DYPzVaS"), // Replace with mainnet mint in production
  USDC: new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"),
};

// Derive the vault authority PDA
async function getVaultAuthority() {
  const [vaultAuthority, bump] = await PublicKey.findProgramAddress(
    [Buffer.from("vault_token")],
    programId
  );
  console.log(`Vault Authority PDA: ${vaultAuthority.toBase58()} (bump: ${bump})`);
  return vaultAuthority;
}

// Create a vault token account for a given mint
async function createVaultTokenAccount(mint, mintName) {
  const vaultAuthority = await getVaultAuthority();

  // Derive the associated token account (ATA) for the vault authority and the mint
  const vaultTokenAccount = await getAssociatedTokenAddress(
    mint,
    vaultAuthority,
    true, // Allow owner off-curve (since vaultAuthority is a PDA)
    TOKEN_PROGRAM_ID
  );

  function getVaultTokenPDA(mint) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("vault_token"), mint.toBuffer()],
      programId
    );
  }

  console.log(`Creating vault token account for ${mintName}: ${vaultTokenAccount.toBase58()}`);

  // Check if the account already exists
  const accountInfo = await connection.getAccountInfo(vaultTokenAccount);
  if (accountInfo) {
    console.log(`Vault token account for ${mintName} already exists.`);
    return;
  }

  // Create a transaction to create the token account
  const transaction = new Transaction().add(
    createAssociatedTokenAccountInstruction(
      adminKeypair.publicKey, // Payer (admin pays for the account creation)
      vaultTokenAccount, // Token account address
      vaultAuthority, // Owner (the vault authority PDA)
      mint, // Mint (USDT or USDC)
      TOKEN_PROGRAM_ID
    )
  );

  // Sign and send the transaction
  const signature = await connection.sendTransaction(transaction, [adminKeypair], {
    skipPreflight: false,
    preflightCommitment: "confirmed",
  });
  await connection.confirmTransaction(signature, "confirmed");
  console.log(`Vault token account for ${mintName} created. Signature: ${signature}`);
}

async function main() {
  console.log(`Admin: ${adminKeypair.publicKey.toBase58()}`);

  // Create vault token accounts for USDT and USDC
  for (const [mintName, mint] of Object.entries(mints)) {
    await createVaultTokenAccount(mint, mintName);
  }

  console.log("All vault token accounts created successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
