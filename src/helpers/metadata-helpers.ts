import { AccountInfo, Connection, PublicKey } from "@solana/web3.js";
import {
  Metadata,
  METADATA_SCHEMA,
} from "./metaplex/classes.js";
import { MetadataKey, METADATA_PREFIX, StringPublicKey } from "./metaplex/types.js";
import { deserializeUnchecked, BinaryReader, BinaryWriter } from "borsh";
// @ts-ignore
import base58 from "bs58";
import {
  METADATA_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  METAPLEX_ID,
  BPF_UPGRADE_LOADER_ID,
  SYSTEM,
  MEMO_ID,
  VAULT_ID,
  AUCTION_ID,
  toPublicKey,
} from "./metaplex/ids.js";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

let STORE: PublicKey | undefined;

export const programIds = () => {
  return {
    token: TOKEN_PROGRAM_ID,
    associatedToken: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
    bpf_upgrade_loader: BPF_UPGRADE_LOADER_ID,
    system: SYSTEM,
    metadata: METADATA_PROGRAM_ID,
    memo: MEMO_ID,
    vault: VAULT_ID,
    auction: AUCTION_ID,
    metaplex: METAPLEX_ID,
    store: STORE,
  };
};

export async function getMetadata(
  pubkey: PublicKey,
  url: string
): Promise<Metadata | undefined> {
  const connection = new Connection(url, "confirmed");
  const metadataKey = await generatePDA(pubkey);
  const accountInfo = await connection.getAccountInfo(toPublicKey(metadataKey));

  if (accountInfo && accountInfo.data.length > 0) {
    if (!isMetadataAccount(accountInfo)) return;

    if (isMetadataV1Account(accountInfo)) {
      const metadata = decodeMetadata(accountInfo.data);

      if (isValidHttpUrl(metadata.data.uri)) {
        return metadata;
      }
    }
  }
}

async function generatePDA(
  tokenMint: PublicKey,
  addEditionToSeeds: boolean = false
): Promise<PublicKey> {
  const PROGRAM_IDS = programIds();

  const metadataSeeds = [
    Buffer.from(METADATA_PREFIX),
    toPublicKey(PROGRAM_IDS.metadata).toBuffer(),
    tokenMint.toBuffer(),
  ];

  if (addEditionToSeeds) {
    metadataSeeds.push(Buffer.from("edition"));
  }

  return (
    await PublicKey.findProgramAddress(
      metadataSeeds,
      toPublicKey(PROGRAM_IDS.metadata)
    )
  )[0];
}

const decodeMetadata = (buffer: Buffer): Metadata => {
  const metadata = deserializeUnchecked(
    METADATA_SCHEMA,
    Metadata,
    buffer
  ) as Metadata;

  // Remove any trailing null characters from the deserialized strings
  metadata.data.name = metadata.data.name.replace(/\0/g, "");
  metadata.data.symbol = metadata.data.symbol.replace(/\0/g, "");
  metadata.data.uri = metadata.data.uri.replace(/\0/g, "");
  metadata.data.name = metadata.data.name.replace(/\0/g, "");
  return metadata;
};

const isMetadataAccount = (account: AccountInfo<Buffer>) =>
  account.owner.toBase58() === METADATA_PROGRAM_ID;

const isMetadataV1Account = (account: AccountInfo<Buffer>) =>
  account.data[0] === MetadataKey.MetadataV1;

function isValidHttpUrl(text: string) {
  try {
    return text.startsWith('http://') || text.startsWith('https://');
  } catch (err) {
    return false;
  }
}

// Required to properly serialize and deserialize pubKeyAsString types
const extendBorsh = () => {
  (BinaryReader.prototype as any).readPubkey = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(32);
    return new PublicKey(array);
  };

  (BinaryWriter.prototype as any).writePubkey = function (value: any) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(value.toBuffer());
  };

  (BinaryReader.prototype as any).readPubkeyAsString = function () {
    const reader = this as unknown as BinaryReader;
    const array = reader.readFixedArray(32);
    return base58.encode(array) as StringPublicKey;
  };

  (BinaryWriter.prototype as any).writePubkeyAsString = function (
    value: StringPublicKey
  ) {
    const writer = this as unknown as BinaryWriter;
    writer.writeFixedArray(base58.decode(value));
  };
};

extendBorsh();
