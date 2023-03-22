import {
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  Keypair,
} from "@solana/web3.js";
import * as splToken from "@solana/spl-token";
import * as mpl from "@metaplex-foundation/mpl-token-metadata";
import * as anchor from "@project-serum/anchor";
//import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
const getConnection = () => {
  // const network = "https://api.devnet.solana.com/";
  const network = "https://api.metaplex.solana.com/";

  const connection = new Connection(network, "processed");
  return connection;
};

export const createTokenMetaData = async (wallet, mintId) => {
  const connection = getConnection();
  const mint = new PublicKey(mintId);
  console.log("Mint id", mint.toString());
  const seed1 = Buffer.from(anchor.utils.bytes.utf8.encode("metadata"));
  const seed2 = Buffer.from(mpl.PROGRAM_ID.toBytes());
  const seed3 = Buffer.from(mint.toBytes());
  const [metadataPDA, _bump] = PublicKey.findProgramAddressSync(
    [seed1, seed2, seed3],
    mpl.PROGRAM_ID
  );
  const accounts = {
    metadata: metadataPDA,
    mint: mint,
    mintAuthority: wallet.publicKey,
    payer: wallet.publicKey,
    updateAuthority: wallet.publicKey,
  };
  const dataV2 = {
    name: "HOX Coin",
    symbol: "HOX",
    uri: "https://gateway.pinata.cloud/ipfs/Qme5yBSqWhkH7Xa57fAyB1r9qTXaQ3Mj5ucZHovyEcFyee",
    // we don't need that
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
  };
  const args = {
    createMetadataAccountArgsV2: {
      data: dataV2,
      isMutable: true,
      // updateAuthority: wallet.publicKey,
      // primarySaleHappened: true,
    },
  };
  const createToken = splToken.createInitializeMintInstruction(
    mint,
    18,
    wallet.publicKey,
    wallet.publicKey
  );
  let ix = mpl.createCreateMetadataAccountV2Instruction(accounts, args);
  // console.log(mint.toString());

  const transaction = new Transaction().add(ix);
  //transaction.add(ix);
  const {
    context: { slot: minContextSlot },
    value: { blockhash, lastValidBlockHeight },
  } = await connection.getLatestBlockhashAndContext();

  try {
    const signature = await wallet.sendTransaction(transaction, connection, {
      minContextSlot,
    });
    console.log(signature);
    const sign = await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature,
    });
    console.log("check logs here: ", sign);
  } catch (error) {
    console.log(error);
  }
};
