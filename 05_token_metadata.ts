import dotenv from "dotenv";
import { getExplorerLink, getKeypairFromEnvironment } from "@solana-developers/helpers";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from "@solana/web3.js";
import { CreateMetadataAccountV3InstructionData } from "@metaplex-foundation/mpl-token-metadata";

dotenv.config();

async function createTokenMetadata() {
  try {
    // Initialize connection and constants
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
    const connection = new Connection(clusterApiUrl("devnet"));
    const OWNER = getKeypairFromEnvironment("KEYPAIR");
    const tokenAccount = new PublicKey("EX7PLA1GqbDxBoRihRKMAnEht6QKWM1dVAsn3fmu24sb");

    // Metadata configuration
    const metadata = {
      name: "Vector Dapp Program",
      symbol: "VDP",
      uri: "https://judevector.vercel.app/",
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    };

    // Find metadata PDA
    const [metadataPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), tokenAccount.toBuffer()],
      TOKEN_METADATA_PROGRAM_ID
    );

    // Create instruction
    const instruction = creat(
      {
        metadata: metadataPDA,
        mint: tokenAccount,
        mintAuthority: OWNER.publicKey,
        payer: OWNER.publicKey,
        updateAuthority: OWNER.publicKey,
      },
      {
        createMetadataAccountV3Args: {
          data: {
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
            creators: metadata.creators,
            collection: metadata.collection,
            uses: metadata.uses,
          },
          isMutable: true,
          collectionDetails: null,
        },
      }
    );

    // Create and send transaction
    const transaction = new Transaction().add(instruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [OWNER]);

    // Log results
    console.log(
      `✅ Token Metadata added: ${getExplorerLink("transaction", signature.toString(), "devnet")}`
    );
    console.log(
      `✅ Look up the token: ${getExplorerLink("address", tokenAccount.toString(), "devnet")}`
    );
  } catch (error) {
    console.error("Error:", error);
  }
}

createTokenMetadata().catch(console.error);
