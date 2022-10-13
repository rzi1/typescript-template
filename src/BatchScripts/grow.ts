import { NS } from '@ns';
export async function main(ns: NS) {
  var target: any = ns.args[0];
  await ns.grow(target);
}
