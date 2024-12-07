import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";

import {
  findMetadataPda,
  mplTokenMetadata,
  verifyCollectionV1,
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

const nftAddress = publicKey("Gv3FQje78eKYu8mjofMu8g3Ycj6m9J8vLJH6Py4xJfy6");

const transaction = await verifyCollectionV1(umi, {
  metadata: findMetadataPda(umi, { mint: nftAddress }),
  collectionMint: collectAddress,
  authority: umi.identity,
});

transaction.sendAndConfirm(umi);

console.log(
  `✅ NFT ${nftAddress} verified as part of collection ${collectAddress}! See Explorer: ${getExplorerLink(
    "address",
    nftAddress,
    "devnet"
  )}`
);
