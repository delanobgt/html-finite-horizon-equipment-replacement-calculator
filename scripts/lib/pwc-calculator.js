PWCCalculator = (function() {

  let memo;
  let trace;
  let machineNames;
  let machineTCs;
  let MARR;
  let horizonYear;

  function _DP(year, i, j) {
    if (year > horizonYear) return 0;
    if (memo[year][i][j] != -1) return memo[year][i][j];

    let optimalResult = 10**10;
    if (j < machineTCs[i].length) { //keep challenger
        optimalResult = _DP(year+1, i, j+1) + (machineTCs[i][j]/(1.0+MARR)**year);
        trace[year][i][j] = [year+1, i, j+1];
    }

    for (let next_i = 1; next_i < machineTCs.length; next_i++) {
        //replace with another challenger
        let replaceResult = _DP(year+1, next_i, 1) + (machineTCs[next_i][0]/(1.0+MARR)**year);
        if (replaceResult < optimalResult) {
            optimalResult = replaceResult;
            trace[year][i][j] = [year+1, next_i, 1];
        }
    }
    memo[year][i][j] = optimalResult;
    return optimalResult;
  }

  function getTraceList() {
    let traceList = [];
    let current = [1, 0, 0];
    let currentMachine = 0;
    let currentMachineYear = -1;
    while(true) {
      current = trace[current[0]][current[1]][current[2]];
      if (!current) {
        if (currentMachineYear != -1) {
          if (currentMachine == 0) traceList.push(`Use Defender( <span class="green">${machineNames[0]}</span> ) for <span class="green">${currentMachineYear}</span> year(s)`);
          else traceList.push(`Use Challenger( <span class="green">${machineNames[currentMachine]}</span> ) for <span class="green">${currentMachineYear}</span> year(s)`);
        }
        break;
      }
      let [year, challengerIdx, j] = current;
      if (j === 1) {
        if (currentMachineYear != -1) {
          if (currentMachine == 0) traceList.push(`Use Defender( <span class="green">${machineNames[0]}</span> ) for <span class="green">${currentMachineYear}</span> year(s)`);
          else traceList.push(`Use Challenger( <span class="green">${machineNames[currentMachine]}</span> ) for <span class="green">${currentMachineYear}</span> year(s)`);
        }
        currentMachine = challengerIdx;
        currentMachineYear = 1;
      } else {
        currentMachineYear += 1
      }
    }
    return traceList;
  }

  function calc(options) {
    memo = __.constructArray([1005, 55, 55], -1);
    trace = __.constructArray([1005, 55, 55], null);
    MARR = options.MARR;
    horizonYear = options.horizonYear;
    machineNames = options.machineNames;
    machineTCs = options.machineTCs;

    let optimalResult = _DP(1, 0, 0);
    let traceList = getTraceList();

    return {
      optimalPWC: optimalResult,
      traceList: traceList
    };
  }

  return {
    calc: calc
  };
})();