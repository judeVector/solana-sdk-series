import {
  keypairIdentity,
  generateSigner,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";

import {
  createNft,
  fetchDigitalAsset,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const user = await getKeypairFromFile();

await airdropIfRequired(connection, user.publicKey, 1 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL);

console.log("Loaded user:", user.publicKey.toBase58());

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey);
umi.use(keypairIdentity(umiUser));

console.log("Set up Umi instance for user!");

const collectAddress = publicKey("3Siv8jtPaHcv9ZL2RLsGXh7zsK2PJsCobqQULBLiAgG3");

console.log(`Creating NFT...`);

const mint = generateSigner(umi);
const transaction = createNft(umi, {
  mint,
  name: "Vector Ape",
  symbol: "VA",
  uri: "https://raw.githubusercontent.com/judeVector/solana-sdk-series/refs/heads/main/sample-nft.json",
  sellerFeeBasisPoints: percentAmount(0),
  collection: {
    key: collectAddress,
    verified: false,
  },
});

await transaction.sendAndConfirm(umi);
const createdNft = await fetchDigitalAsset(umi, mint.publicKey);

console.log(
  `🖼️ Created NFT! Address is ${getExplorerLink("address", createdNft.mint.publicKey, "devnet")}`
);
