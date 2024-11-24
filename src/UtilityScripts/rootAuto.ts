import { NS, Player } from '@ns';
import { getRemoteServers } from 'utils.js';
export async function main(ns: NS) {
  ns.disableLog('ALL');
  var rooted: string[] = [];
  while (true) {
    var servers = getRemoteServers(ns);
    var player = ns.getPlayer();
    for (var server of servers) {
      if (!rooted.includes(server)) {
        rooted = await checkHacking(server, player, ns, rooted);
      }
    }
    await ns.sleep(25000);
  }
}

async function checkHacking(
  server: string,
  player: Player,
  ns: NS,
  rooted: string[]
): Promise<string[]> {
  if (ns.hasRootAccess(server)) {
    ns.print('Have root access: ' + server);
    rooted.push(server);
    return rooted;
  } else {
    var serverHackingLevel = ns.getServerRequiredHackingLevel(server);
    if (player.skills.hacking >= serverHackingLevel) {
      ns.print('Attempting to hack: ' + server);
      var portsRequired = ns.getServerNumPortsRequired(server);
      if (portsRequired > 4) {
        if (ns.fileExists('SQLInject.exe')) {
          ns.print('Running SQL Inject on: ' + server);
          ns.sqlinject(server);
        } else {
          return rooted;
        }
      }
      if (portsRequired > 3) {
        if (ns.fileExists('HTTPWorm.exe')) {
          ns.print('Running HTTP Worm on: ' + server);
          ns.httpworm(server);
        } else {
          return rooted;
        }
      }
      if (portsRequired > 2) {
        if (ns.fileExists('relaySMTP.exe')) {
          ns.print('Opening SMTP Port: ' + server);
          ns.relaysmtp(server);
        } else {
          return rooted;
        }
      }
      if (portsRequired > 1) {
        if (ns.fileExists('FTPCrack.exe')) {
          ns.print('FTP Cracking: ' + server);
          ns.ftpcrack(server);
        } else {
          return rooted;
        }
      }
      if (portsRequired > 0) {
        if (ns.fileExists('BruteSSH.exe')) {
          ns.print('Brute SSH: ' + server);
          ns.brutessh(server);
        } else {
          return rooted;
        }
      }
      ns.print('Nuking: ' + server);
      ns.nuke(server);
    }
    if (ns.hasRootAccess(server)) {
      ns.tprint('Acquired root access to ' + server);
      rooted.push(server);
      return rooted;
    }
    return rooted;
  }
}
