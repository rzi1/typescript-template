import { NS } from "@ns";
import { getRootServers } from 'getRootServers.js';
export async function main(ns: NS) {
	var deployedServers = ["home"];
	while (true) {
		var rootServers = getRootServers(ns);
		for (var server in rootServers) {
			var tarServer = rootServers[server];
			if (!deployedServers.includes(tarServer)) {
				deployKillExecute(ns, tarServer);
				deployedServers.push(tarServer);
			}
		}
		await ns.sleep(20000);
	}

}

function deployKillExecute(ns:NS, server:string) {
	var targetFile = "irongym.js";
	ns.scp(targetFile, server);
	ns.killall(server);
	var freeRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
	var threads = Math.floor(freeRam / ns.getScriptRam(targetFile, server));
	if (threads > 0) {
		ns.exec(targetFile, server, threads);
	} else {
		return;
	}
}