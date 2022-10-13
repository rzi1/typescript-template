import { getRemoteServers } from 'getRemoteServers.js';
import { NS } from '@ns';
export async function main(ns: NS) {
  var servers = getRemoteServers(ns);
  var player = ns.getPlayer();
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  for (var server in servers) {
    var { hostname, moneyMax, requiredHackingSkill } = ns.getServer(
      servers[server]
    );

    if (player.skills.hacking > requiredHackingSkill && moneyMax > 0) {
      ns.tprintf(
        'Hostname: %s || Max Money: %s || Hacking Skill: %d',
        hostname,
        formatter.format(moneyMax),
        requiredHackingSkill
      );
    }
  }
}
