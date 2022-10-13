import { NS } from "@ns";
export function getRemoteServers(ns:NS): string[] {
	var checked: string[] = [];
	var ownedServers = ns.getPurchasedServers();
	var toCheck = [];
	var serverList = [];
	var serversDepth0 = ns.scan("home");
	for (var server in serversDepth0) {
		var newServer = serversDepth0[server];
		if (!checked.includes(newServer) && !ownedServers.includes(newServer)) {
			toCheck.push(newServer);
			serverList.push(newServer);
		}
	}
	checked.push("home");
	while (toCheck.length > checked.length) {
		for (var server in toCheck) {
			var toCheckServer = toCheck[server];
			if (!checked.includes(toCheckServer)) {
				checked.push(toCheckServer);
				var newServers = ns.scan(toCheckServer);
				for (var server in newServers) {
					var newServer = newServers[server];
					if (!checked.includes(newServer)) {
						toCheck.push(newServer);
						serverList.push(newServer);
					}

				}
			}
		}
	}
	return serverList;
}