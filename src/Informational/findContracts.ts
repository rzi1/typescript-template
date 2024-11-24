import { NS, Server } from '@ns';
import { getAllServers } from './utils';

export async function main(ns: NS): Promise<void> {
  var servers: string[] = getAllServers(ns);
  for (var server of servers) {
    var contracts = ns.ls(server, '.cct');
    for (var contract of contracts) {
      var type = ns.codingcontract.getContractType(contract, server);
      var desc = ns.codingcontract.getDescription(contract, server);
      var data = ns.codingcontract.getData(contract, server);
      ns.tprintf('%s contract on %s', type, server);
      //   ns.tprintf('Description: %s', desc);
      //   ns.tprintf('Data: %s', data);
    }
  }
}
