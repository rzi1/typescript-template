import { NS, Player } from '@ns';
import { getRootServers, getFreeRam } from 'utils.js';
export async function main(ns: NS) {
  var player: Player = ns.getPlayer();
  var hacking = player.skills.hacking;
  var attackScript = getAttackScript(hacking);
  var rootedServers = getRootServers(ns);
  for (var server in rootedServers) {
    var serverFreeRam = getFreeRam(ns, rootedServers[server]);
    ns.scp(attackScript, rootedServers[server]);
    var scriptRam = ns.getScriptRam(attackScript, rootedServers[server]);
    if (server == 'home') {
      serverFreeRam -= 128;
      if (serverFreeRam < 0) {
        continue;
      }
    }
    if (serverFreeRam > scriptRam) {
      ns.printf(
        'Server: %s Free RAM: %d Script RAM: %d',
        rootedServers[server],
        serverFreeRam,
        scriptRam
      );
      var servable = Math.floor(serverFreeRam / scriptRam);
      ns.printf('Threads: %d', servable);
      ns.print('deploying to: ', server);
      ns.exec(attackScript, rootedServers[server], servable);
    }
  }
}

function getAttackScript(hacking: number) {
  if (hacking > 1000) {
  } else if (hacking < 30) {
    return 'GeneralAttackScripts/skill1.js';
  } else if (hacking < 100) {
    return 'GeneralAttackScripts/skill30.js';
  } else if (hacking < 300) {
    return 'GeneralAttackScripts/skill100.js';
  } else if (hacking < 450) {
    return 'GeneralAttackScripts/skill300.js';
  } else {
    return 'GeneralAttackScripts/skill450.js';
  }
}
