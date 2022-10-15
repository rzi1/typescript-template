import { NS } from '@ns';
import { getTargets } from './utils';
export async function main(ns: NS) {
  var deployed: string[] = [];
  while (true) {
    var targets: string[] = getTargets(ns);
    for (var i in targets) {
      var target = targets[i];
      if (!deployed.includes(target)) {
        ns.printf('Deploying controller for %s', target);
        ns.exec('pidController.js', 'home', 1, target);
        deployed.push(target);
      }
    }
    await ns.sleep(25000);
  }
}
