import { describe, expect, it } from "vitest";
import { Networks, Operation, xdr } from "@stellar/stellar-sdk";
import fixture from "./__fixtures__/verify-proof.json";
import { buildVerifyCall, ProofEncodingError } from "./verify";
import type { Groth16Proof } from "snarkjs";

const CONTRACT_ID = "CDNSZUNEWFCGSPWLPDSWTENR2WPHKC34RGZQG7RJA54OPGTZGVVRFYBA";

describe("buildVerifyCall", () => {
  it("builds a ready-to-sign Soroban transaction from a known proof fixture", async () => {
    const tx = await buildVerifyCall(
      fixture.proof as Groth16Proof,
      fixture.publicInputs,
      CONTRACT_ID,
      Networks.TESTNET,
    );
    const envelope = xdr.TransactionEnvelope.fromXDR(tx.toXDR(), "base64");
    const operation = envelope.v1().tx().operations()[0];

    expect(tx.networkPassphrase).toBe(Networks.TESTNET);
    expect(tx.operations).toHaveLength(1);
    expect(operation.body().switch().name).toBe("invokeHostFunction");

    const invoke = Operation.fromXDRObject(operation).func;
    expect(invoke.switch().name).toBe("hostFunctionTypeInvokeContract");

    const args = invoke.invokeContract().args();
    expect(args).toHaveLength(2);
    expect(args[0].switch()).toEqual(xdr.ScValType.scvMap());
    expect(args[1].switch()).toEqual(xdr.ScValType.scvVec());

    const proofEntries = args[0].map()?.map((entry) =>
      Buffer.from(entry.val().bytes() ?? []).toString("hex"),
    );
    expect(proofEntries).toEqual([
      "06b93f96ed20999901cc48454c3c679c7dba1cce9d8705938400f1b7268b75e62e826fa485e93ba4d9b087df52b68f551116c8224bc212144a2ec513d4768829",
      "0506e0126ea65f0682a5518398abc386396b5760d35a7348dac5450c91160eb92e7015079ae46f073a41d6bf9a1c7df6b282a74397d973d685a0b38ca6102cdf1bb7eacb941ed9efe0a2b3e784953b3726acb9f322f8da095e0e2b8857ce93191a66849b4354139a76be8d621516c2702a9f8b329caa583a03278dd7201bfa27",
      "1efddd1616f866a6ca2d9564042072fe552160f544665c12f5c6a952ec934dbb0e3908022f9ad683338d0f2f3589441e7bc594e2a5b23e63d75741795fadf430",
    ]);
  });

  it.each([Networks.TESTNET, Networks.PUBLIC])(
    "works with %s network passphrase",
    async (networkPassphrase) => {
      const tx = await buildVerifyCall(
        fixture.proof as Groth16Proof,
        fixture.publicInputs,
        CONTRACT_ID,
        networkPassphrase,
      );

      expect(tx.networkPassphrase).toBe(networkPassphrase);
    },
  );

  it("throws ProofEncodingError for malformed proofs", async () => {
    const malformedProof: Groth16Proof = {
      pi_a: ["1"],
      pi_b: [["2", "3"], ["4", "5"]],
      pi_c: ["6", "7"],
      curve: "bn128",
      protocol: "groth16",
    };

    await expect(
      buildVerifyCall(malformedProof, fixture.publicInputs, CONTRACT_ID, Networks.TESTNET),
    ).rejects.toBeInstanceOf(ProofEncodingError);
  });
});
