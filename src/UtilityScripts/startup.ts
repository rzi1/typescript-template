import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {
  var rootPid = ns.exec('rootAuto.js', 'home');
  ns.tail(rootPid);
  ns.exec('deployControllers.js', 'home');
  var buyPid = ns.exec('buyUpgradeServer.js', 'home');
  ns.tail(buyPid);
  ns.tprint('Startup Complete');
}
