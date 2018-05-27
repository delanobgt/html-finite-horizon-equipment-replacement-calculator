let __ = (function() {
  function formatGeneralCurrency(value) {
    let numberValue = Number(value);
    let formattedString;
    try {
      formattedString = numberValue.toLocaleString('en-US', {minimumFractionDigits: 0, maximumFractionDigits: 10});
    } catch (err) {
      formattedString = numberValue+'';
    }
    return formattedString;
  }

  function toNumber(token) {
    let stringToken = token+'';
    let cleanToken = stringToken.replace(/[^0-9\.]+/g, '');
    let numberToken = Number(cleanToken);
    return numberToken;
  }

  function constructArray(dimensions, value, pos) {
    if (pos === undefined) return constructArray(dimensions, value, 0);
    if (pos >= dimensions.length) return value;
    let newArray = [];
    for (let i = 0; i < dimensions[pos]; i++) {
      newArray.push(constructArray(dimensions, value, pos+1));
    }
    return newArray;
  }

  return {
    formatGeneralCurrency: formatGeneralCurrency,
    toNumber: toNumber,
    constructArray: constructArray
  };
})();