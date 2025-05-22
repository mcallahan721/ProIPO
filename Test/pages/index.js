import { useEffect, useState } from "react";

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [error, setError] = useState("");

  const PORTFOLIO_KEY = "statstakes_portfolio";

  useEffect(() => {
    const stored = localStorage.getItem(PORTFOLIO_KEY);
    if (stored) setPortfolio(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(PORTFOLIO_KEY, JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    fetch("/api/players")
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => {
        console.error("API error:", err);
        setError("Failed to load player data.");
      });
  }, []);

  const buy = (player) => {
    setPortfolio(prev => {
      const existing = prev.find(p => p.id === player.id);
      if (existing) {
        return prev.map(p => p.id === player.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...player, quantity: 1 }];
    });
  };

  const sell = (id) => {
    setPortfolio(prev =>
      prev
        .map(p => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter(p => p.quantity > 0)
    );
  };

  const reset = () => {
    if (confirm("Reset your portfolio?")) {
      setPortfolio([]);
      localStorage.removeItem(PORTFOLIO_KEY);
    }
  };

  const total = portfolio.reduce((sum, p) => sum + p.quantity * p.price, 0);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>📈 StatStakes Live NFL Market</h1>
      <button onClick={reset} style={{ marginBottom: "1rem" }}>🔁 Reset Portfolio</button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>🏈 Player Market</h2>
      <table><thead><tr><th>Name</th><th>Team</th><th>Pos</th><th>Price</th><th></th></tr></thead><tbody>
        {players.map(p => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.team}</td>
            <td>{p.position}</td>
            <td>${p.price}</td>
            <td><button onClick={() => buy(p)}>Buy</button></td>
          </tr>
        ))}
      </tbody></table>

      <h2>📦 Portfolio</h2>
      {portfolio.length === 0 ? <p>No shares owned yet.</p> : (
        <>
          <table><thead><tr><th>Name</th><th>Qty</th><th>Price</th><th>Total</th><th></th></tr></thead><tbody>
            {portfolio.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>${p.price}</td>
                <td>${(p.price * p.quantity).toFixed(2)}</td>
                <td><button onClick={() => sell(p.id)}>Sell</button></td>
              </tr>
            ))}
          </tbody></table>
          <p><strong>Total Value: ${total.toFixed(2)}</strong></p>
        </>
      )}
    </div>
  );
}
