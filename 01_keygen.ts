import { Keypair } from "@solana/web3.js";

const keypair = Keypair.generate();
console.log(`This is the public key: ${keypair.publicKey}`);
console.log(`This is the private key: ${keypair.secretKey}`);
