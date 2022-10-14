import { NS } from '@ns';
export async function main(ns: NS) {
  var target: any = ns.args[0];
  var waitTime: any = ns.args[1];
  if (waitTime !== 0) {
    ns.sleep(waitTime);
  }
  await ns.hack(target);
}
