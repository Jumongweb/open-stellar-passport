// Captions transcribed from public/narration.mp3 (whisper base.en) + spelling fixes.
// { from, to } in ms.
export type Caption = { from: number; to: number; text: string };
export const CAPTIONS: Caption[] = [
  {
    "from": 0,
    "to": 6560,
    "text": "Agent Passport, a zero-knowledge credential that lets AI agents pay on Stellar without trusting the agent."
  },
  {
    "from": 7520,
    "to": 13120,
    "text": "AI agents are starting to make payments autonomously, today that usually means giving them access"
  },
  {
    "from": 13120,
    "to": 21120,
    "text": "to your keys, or completing KYC through a centralized intermediary. Both create unnecessary exposure of"
  },
  {
    "from": 21120,
    "to": 28080,
    "text": "funds or identity. Agent Passport solves this with a single zero-knowledge proof. The owner sets a"
  },
  {
    "from": 28080,
    "to": 34240,
    "text": "spending limit and generates a Groth16 proof directly in the browser. The proof confirms three"
  },
  {
    "from": 34240,
    "to": 40160,
    "text": "things. The agent is backed by a registered human, is resistant to Sybil attacks, and has enough"
  },
  {
    "from": 40160,
    "to": 45680,
    "text": "balance to cover the spending cap. The private key and account balance never leave the device."
  },
  {
    "from": 46240,
    "to": 53200,
    "text": "The proof is then verified on chain. Soroban executes the BN254 pairing verification and"
  },
  {
    "from": 53200,
    "to": 59840,
    "text": "issues a zk-passport attestation. This is already running on Stellar testnet. No wallet connection"
  },
  {
    "from": 59840,
    "to": 67200,
    "text": "required. The demo uses a read-only simulation. Now comes the x402 gate. If the payment stays"
  },
  {
    "from": 67200,
    "to": 72720,
    "text": "within the proven spending cap, it is authorized. If it exceeds the limit, it is rejected."
  },
  {
    "from": 73520,
    "to": 79280,
    "text": "The actual balance is never revealed. Only cryptographic proof that sufficient funds exist."
  },
  {
    "from": 79840,
    "to": 86400,
    "text": "Each passport consumes a one-time nullifier. Any attempt to reuse a spent proof is rejected on chain."
  },
  {
    "from": 87040,
    "to": 91200,
    "text": "Replay resistance and Sybil resistance are enforced directly by the contract."
  },
  {
    "from": 92080,
    "to": 97920,
    "text": "Under the hood, Agent Passport uses a Circom circuit with approximately 9,600 constraints."
  },
  {
    "from": 98480,
    "to": 104880,
    "text": "It also uses two smart contracts deployed on Stellar testnet, a BN254 verifier,"
  },
  {
    "from": 104880,
    "to": 111360,
    "text": "and a stateful validator that manages nullifiers and records attestations. Agent Passport reuses"
  },
  {
    "from": 111360,
    "to": 119040,
    "text": "Nethermind’s verifier implementation and aligns with the ERC-8004 for Agent Identity. Fully open source,"
  },
  {
    "from": 119040,
    "to": 122480,
    "text": "open Stellar passport on GitHub. Thanks for watching."
  }
];
