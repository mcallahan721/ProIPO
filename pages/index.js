import React, { useState, useEffect } from "react";
import AthleteMarket from "../AthleteMarket.jsx";
import Portfolio from "../Portfolio.jsx";

const PORTFOLIO_KEY = "statstakes_portfolio";

export default function Home() {
  const [portfolio, setPortfolio] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PORTFOLIO_KEY);
    if (stored) {
      setPortfolio(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  // Simulate price fluctuation every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio((prevPortfolio) =>
        prevPortfolio.map((player) => ({
          ...player,
          price: fluctuatePrice(player.price),
        }))
      );
      setAllPlayers((prevPlayers) =>
        prevPlayers.map((player) => ({
          ...player,
          price: fluctuatePrice(player.price),
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fluctuatePrice = (price) => {
    const changePercent = Math.random() * 0.05; // up to 5%
    const direction = Math.random() > 0.5 ? 1 : -1;
    const newPrice = price + price * changePercent * direction;
    return Math.max(1, parseFloat(newPrice.toFixed(2)));
  };

  const handleBuy = (athlete) => {
    setPortfolio((prev) => {
      const existing = prev.find((a) => a.id === athlete.id);
      if (existing) {
        return prev.map((a) =>
          a.id === athlete.id ? { ...a, quantity: a.quantity + 1 } : a
        );
      }
      return [...prev, { ...athlete, quantity: 1 }];
    });
  };

  const handleSell = (athleteId) => {
    setPortfolio((prev) =>
      prev
        .map((a) =>
          a.id === athleteId ? { ...a, quantity: a.quantity - 1 } : a
        )
        .filter((a) => a.quantity > 0)
    );
  };

  const resetPortfolio = () => {
    if (window.confirm("Are you sure you want to reset your portfolio?")) {
      setPortfolio([]);
      localStorage.removeItem(PORTFOLIO_KEY);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📈 StatStakes: Live NFL Player Market</h1>
        <button
          onClick={resetPortfolio}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Reset Portfolio
        </button>
      </div>
      {showToast && (
        <div className="mb-4 p-3 bg-green-200 text-green-800 rounded">
          Portfolio has been reset.
        </div>
      )}
      <AthleteMarket onBuy={handleBuy} externalPlayers={allPlayers} setExternalPlayers={setAllPlayers} />
      <Portfolio portfolio={portfolio} onSell={handleSell} />
    </div>
  );
}
