import { NS } from '@ns';
export async function main(ns: NS) {
  const types = ns.codingcontract.getContractTypes();
  for (const type of types) {
    ns.codingcontract.createDummyContract(type);
  }
}
