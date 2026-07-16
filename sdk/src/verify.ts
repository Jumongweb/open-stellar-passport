import {
  Account,
  BASE_FEE,
  Contract,
  TransactionBuilder,
  nativeToScVal,
  type Transaction,
} from "@stellar/stellar-sdk";
import { NULL_ACCOUNT } from "@stellar/stellar-sdk/contract";
import type { Groth16Proof } from "snarkjs";
const VERIFY_METHOD = "verify_and_register";
const FIELD_HEX_BYTES = 32;
const G1_COORDINATES = 2;
const G2_ROWS = 2;
const G2_COORDINATES = 2;

/**
 * Thrown when a Groth16 proof cannot be encoded into the Soroban call format.
 */
export class ProofEncodingError extends Error {
  readonly cause?: unknown;

  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "ProofEncodingError";
    this.cause = options?.cause;
  }
}

function normalizeHexInput(value: string): bigint {
  const trimmed = value.trim();
  if (!trimmed) throw new ProofEncodingError("public input must not be empty");
  const hex = trimmed.startsWith("0x") || trimmed.startsWith("0X") ? trimmed : `0x${trimmed}`;
  try {
    return BigInt(hex);
  } catch (cause) {
    throw new ProofEncodingError(`invalid public input hex: ${value}`, { cause });
  }
}

function encodeFieldElement(value: string, name: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new ProofEncodingError(`${name} must be a non-empty string`);
  }

  let encoded: string;
  try {
    encoded = BigInt(value).toString(16);
  } catch (cause) {
    throw new ProofEncodingError(`invalid field element for ${name}`, { cause });
  }

  if (encoded.startsWith("-")) {
    throw new ProofEncodingError(`${name} must not be negative`);
  }
  if (encoded.length > FIELD_HEX_BYTES * 2) {
    throw new ProofEncodingError(`${name} exceeds 32 bytes`);
  }

  return encoded.padStart(FIELD_HEX_BYTES * 2, "0");
}

function encodeG1(point: unknown, name: "pi_a" | "pi_c"): Buffer {
  if (!Array.isArray(point) || point.length < G1_COORDINATES) {
    throw new ProofEncodingError(`proof.${name} must contain 2 coordinates`);
  }

  const hex = point
    .slice(0, G1_COORDINATES)
    .map((coordinate, index) => encodeFieldElement(coordinate, `proof.${name}[${index}]`))
    .join("");

  return Buffer.from(hex, "hex");
}

function encodeG2(point: unknown): Buffer {
  if (!Array.isArray(point) || point.length < G2_ROWS) {
    throw new ProofEncodingError("proof.pi_b must contain 2 rows");
  }

  const rows = point.slice(0, G2_ROWS);
  for (const [rowIndex, row] of rows.entries()) {
    if (!Array.isArray(row) || row.length < G2_COORDINATES) {
      throw new ProofEncodingError(`proof.pi_b[${rowIndex}] must contain 2 coordinates`);
    }
  }

  const hex = [
    encodeFieldElement(rows[0][1], "proof.pi_b[0][1]"),
    encodeFieldElement(rows[0][0], "proof.pi_b[0][0]"),
    encodeFieldElement(rows[1][1], "proof.pi_b[1][1]"),
    encodeFieldElement(rows[1][0], "proof.pi_b[1][0]"),
  ].join("");

  return Buffer.from(hex, "hex");
}

function encodeProof(proof: Groth16Proof): { a: Buffer; b: Buffer; c: Buffer } {
  if (!proof || typeof proof !== "object") {
    throw new ProofEncodingError("proof must be an object");
  }

  return {
    a: encodeG1(proof.pi_a, "pi_a"),
    b: encodeG2(proof.pi_b),
    c: encodeG1(proof.pi_c, "pi_c"),
  };
}

function encodeVerifyArgs(
  proof: Groth16Proof,
  publicInputs: string[],
): ReturnType<typeof nativeToScVal>[] {
  const normalizedPublicInputs = publicInputs.map(normalizeHexInput);

  try {
    const encodedProof = encodeProof(proof);
    return [
      nativeToScVal(encodedProof),
      nativeToScVal(normalizedPublicInputs),
    ];
  } catch (cause) {
    if (cause instanceof ProofEncodingError) throw cause;
    throw new ProofEncodingError("failed to encode proof for Soroban verify call", { cause });
  }
}

/**
 * Build an unsigned Soroban verification transaction for the validator contract.
 *
 * @param proof - Raw `snarkjs` Groth16 proof with `pi_a`, `pi_b`, and `pi_c` coordinates.
 * @param publicInputs - Public input field elements as hex strings, with or without a `0x` prefix.
 * @param contractId - Target validator contract ID.
 * @param networkPassphrase - Stellar network passphrase, e.g. testnet or mainnet.
 * @returns A Soroban contract invocation transaction ready to be signed.
 */
export async function buildVerifyCall(
  proof: Groth16Proof,
  publicInputs: string[],
  contractId: string,
  networkPassphrase: string,
): Promise<Transaction> {
  const args = encodeVerifyArgs(proof, publicInputs);
  const contract = new Contract(contractId);
  const source = new Account(NULL_ACCOUNT, "0");

  return new TransactionBuilder(source, {
    fee: BASE_FEE,
    networkPassphrase,
  })
    .addOperation(contract.call(VERIFY_METHOD, ...args))
    .setTimeout(0)
    .build();
}
