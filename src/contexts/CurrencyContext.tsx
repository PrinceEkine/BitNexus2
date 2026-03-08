import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'NGN' | 'USD' | 'EUR' | 'GBP';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  exchangeRates: Record<CurrencyCode, number>;
  convert: (amount: number, from: CurrencyCode, to: CurrencyCode) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem('bitnexus_currency');
    return (saved as CurrencyCode) || 'NGN';
  });

  // Mock exchange rates (Base: NGN)
  const exchangeRates: Record<CurrencyCode, number> = {
    NGN: 1,
    USD: 0.00067, // Example: 1 NGN = 0.00067 USD
    EUR: 0.00062,
    GBP: 0.00053,
  };

  useEffect(() => {
    const detectCurrency = async () => {
      // If user already manually selected, don't override
      if (localStorage.getItem('bitnexus_currency')) return;

      const countryToCurrency: Record<string, CurrencyCode> = {
        'NG': 'NGN', 'US': 'USD', 'GB': 'GBP', 'DE': 'EUR', 'FR': 'EUR',
        'IT': 'EUR', 'ES': 'EUR', 'NL': 'EUR', 'BE': 'EUR', 'IE': 'EUR',
        'AT': 'EUR', 'PT': 'EUR', 'GR': 'EUR', 'FI': 'EUR',
      };

      // Fallback: Guess by timezone
      const guessByTimezone = () => {
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
          if (tz.includes('Lagos')) return 'NGN';
          if (tz.includes('London')) return 'GBP';
          if (tz.includes('New_York') || tz.includes('Los_Angeles') || tz.includes('Chicago')) return 'USD';
          if (tz.includes('Europe')) return 'EUR';
        } catch (e) {}
        return null;
      };

      try {
        // Try ipapi.co (with a short timeout)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            const detected = countryToCurrency[data.country_code];
            if (detected) {
              setCurrencyState(detected);
              return;
            }
          }
        }
      } catch (error) {
        // Silent fail for fetch, move to fallback
      }

      // Final fallback
      const guessed = guessByTimezone();
      if (guessed && guessed !== currency) {
        setCurrencyState(guessed);
      }
    };

    detectCurrency();
  }, []);

  const setCurrency = (newCurrency: CurrencyCode) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('bitnexus_currency', newCurrency);
  };

  const convert = (amount: number, from: CurrencyCode, to: CurrencyCode) => {
    const amountInBase = amount / exchangeRates[from];
    return amountInBase * exchangeRates[to];
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRates, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
