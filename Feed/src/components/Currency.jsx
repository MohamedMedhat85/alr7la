import { useState, useEffect } from 'react';

export default function CurrencyConverter({ country = {} }) {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState(
    country.currencies && country.currencies.length > 0 ? country.currencies[0].code : 'EGP'
  );
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [conversionRate, setConversionRate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Use country currencies if available, otherwise use default list
  const currencies = country.currencies && country.currencies.length > 0
    ? country.currencies.map(c => c.code)
    : ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'EGP', 'INR', 'BRL', 'RUB', 'KRW', 'SGD', 'NZD', 'MXN'];

  const fetchConversionRate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/23e766e4e54c0289e1af5a4f/pair/${fromCurrency}/${toCurrency}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch conversion rate');
      }

      const data = await response.json();

      if (data.result === 'success') {
        setConversionRate(data.conversion_rate);
        setConvertedAmount((amount * data.conversion_rate).toFixed(2));
        setLastUpdated(data.time_last_update_utc);
      } else {
        throw new Error(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    if (fromCurrency && toCurrency && amount > 0) {
      fetchConversionRate();
    }
  }, [amount, fromCurrency, toCurrency]);

  return (
    <div className="flex flex-col max-w-md mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Currency Converter {country.name && `- ${country.name}`}
      </h1>

      <div className="space-y-4">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0.01"
            step="0.01"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-5 gap-2 items-center">
          <div className="col-span-2">
            <label className="mb-1 text-sm font-medium">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map((currency) => (
                <option key={`from-${currency}`} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSwapCurrencies}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"
            >
              ⇄
            </button>
          </div>

          <div className="col-span-2">
            <label className="mb-1 text-sm font-medium">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {currencies.map((currency) => (
                <option key={`to-${currency}`} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Optional Convert Button (still here if needed manually) */}
        {/* 
        <button
          onClick={fetchConversionRate}
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          {isLoading ? 'Converting...' : 'Convert'}
        </button>
        */}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {convertedAmount && !error && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <div className="text-center">
            <div className="text-sm text-gray-500">Conversion Result</div>
            <div className="text-2xl font-bold mt-1">
              {amount} {fromCurrency} = {convertedAmount} {toCurrency}
            </div>
            {conversionRate && (
              <div className="text-sm text-gray-600 mt-2">
                1 {fromCurrency} = {conversionRate} {toCurrency}
              </div>
            )}
          </div>

          {lastUpdated && (
            <div className="text-xs text-gray-500 mt-4 text-center">
              Last updated: {lastUpdated}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
