// src/lib/marketService.js
const FINNHUB_KEY = 'd74gtu1r01qno4q1nfpgd74gtu1r01qno4q1nfq0'; 

export const getLivePrice = async (symbol) => {
  try {
    // Note: For PSX stocks, some APIs require symbols like "ENGRO.KA"
    // Finnhub primarily supports US/Global. Adjust symbol as needed.
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`);
    const data = await response.json();
    
    // 'c' is the current price in Finnhub's response
    return data.c ? data.c : null;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
};