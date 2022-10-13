import {NS, Player} from '@ns';
import {getRemoteServers } from 'getRemoteServers.js';
export async function main(ns:NS) {
    ns.disableLog('ALL');
    while (true) {
        var servers = await getRemoteServers(ns);
        var player = await ns.getPlayer();
        for (var i = 0; i < servers.length; i++) {
            await checkHacking(servers[i], player, ns);
        }
        ns.print("Servers: " + servers);
        await ns.sleep(20000);
    }
}

async function checkHacking(server:string, player:Player, ns: NS) {
    if (ns.hasRootAccess(server)) {
        ns.print("Have root access: " + server);
        return;
    }

    var serverHackingLevel = ns.getServerRequiredHackingLevel(server);

    if (player.exp.hacking >= serverHackingLevel) {
        ns.print("Attempting to hack: " + server)
        var portsRequired = ns.getServerNumPortsRequired(server);
        if (portsRequired > 4) {
            if (ns.fileExists("SQLInject.exe")) {
                ns.print("Running SQL Inject on: " + server);
                ns.sqlinject(server);
            } else {
                return;
            }
        }
        if (portsRequired > 3) {
            if (ns.fileExists("HTTPWorm.exe")) {
                ns.print("Running HTTP Worm on: " + server);
                ns.httpworm(server);
            } else {
                return;
            }
        }
        if (portsRequired > 2) {
            if (ns.fileExists("relaySMTP.exe")) {
                ns.print("Opening SMTP Port: " + server);
                ns.relaysmtp(server);
            } else {
                return;
            }
        }
        if (portsRequired > 1) {
            if (ns.fileExists("FTPCrack.exe")) {
                ns.print("FTP Cracking: " + server);
                ns.ftpcrack(server);

            } else {
                return;
            }
        }
        if (portsRequired > 0) {
            if (ns.fileExists("BruteSSH.exe")) {
                ns.print("Brute SSH: " + server);
                ns.brutessh(server);
            } else {
                return;
            }
        }
        ns.print("Nuking: " + server);
        ns.nuke(server);
    }
}