import { NS } from '@ns';
//use when hacking skill > 100

export async function main(ns: NS) {
  var target = 'harakiri-sushi';
  var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
  var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
  while (true) {
    if (ns.getServerSecurityLevel(target) > securityThresh) {
      await ns.weaken(target);
    } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
      await ns.grow(target);
    } else {
      await ns.hack(target);
    }
  }
}
