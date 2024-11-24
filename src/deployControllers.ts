import { NS } from '@ns';
import { getTargets } from './utils';
export async function main(ns: NS) {
  var deployed: string[] = [];
  while (true) {
    var targets: string[] = getTargets(ns);
    for (var i in targets) {
      var target = targets[i];
      if (!deployed.includes(target)) {
        var pid = ns.exec('pidController.js', 'home', 1, target);
        if (pid !== undefined) {
          deployed.push(target);
          ns.printf('Deployed controller for %s', target);
        }
      }
    }
    await ns.sleep(25000);
  }
}
