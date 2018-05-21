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

  return {
    formatGeneralCurrency: formatGeneralCurrency,
    toNumber: toNumber
  };
})();