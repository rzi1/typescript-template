import { NS } from '@ns';

export async function main(ns: NS) {
  const doc = document; // This is expensive! (25GB RAM) Perhaps there's a way around it? ;)
  const hook0 = doc.getElementById('overview-extra-hook-0');
  const hook1 = doc.getElementById('overview-extra-hook-1');
  while (true) {
    try {
      const headers = [];
      const values = [];
      const [income, exp] = findScriptIncomeAndExp(ns);
      // Add script income per second
      headers.push('ScrInc');
      values.push(income.toPrecision(2) + '/sec');
      // Add script exp gain rate per second
      headers.push('ScrExp');
      values.push(exp.toPrecision(2) + '/sec');

      // TODO: Add more neat stuff
      headers.push('Karma:');
      values.push(ns.heart.break());

      // Now drop it into the placeholder elements
      hook0.innerText = headers.join(' \n');
      hook1.innerText = values.join('\n');
    } catch (err) {
      // This might come in handy later
      ns.print('ERROR: Update Skipped: ' + String(err));
    }
    await ns.sleep(1000);
  }
}

function findScriptIncomeAndExp(ns: NS): number[] {
  var scripts = ns.ps('home');
  var income = 0;
  var exp = 0;
  for (var script of scripts) {
    var runningScript = ns.getRunningScript(script.pid);
    if (runningScript?.onlineRunningTime) {
      var scriptIncome = runningScript?.onlineMoneyMade
        ? runningScript.onlineMoneyMade / runningScript.onlineRunningTime
        : 0;
      income += scriptIncome;
      var scriptExp = runningScript?.onlineExpGained
        ? runningScript.onlineExpGained / runningScript.onlineRunningTime
        : 0;
      exp += scriptExp;
    }
  }

  return [income, exp];
}
