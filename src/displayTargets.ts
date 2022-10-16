import { getTargets } from './utils';
import { NS } from '@ns';
export async function main(ns: NS) {
  var servers = getTargets(ns);
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  for (var server of servers) {
    var { hostname, moneyMax, requiredHackingSkill, moneyAvailable } =
      ns.getServer(server);
    ns.tprintf(
      'Hostname: %s || Max Money: %s || Current Money: %s || Hacking Skill: %d',
      hostname,
      formatter.format(moneyMax),
      formatter.format(moneyAvailable),
      requiredHackingSkill
    );
  }
}
