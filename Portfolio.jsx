import React from "react";

export default function Portfolio({ portfolio, onSell }) {
  const totalValue = portfolio.reduce(
    (sum, player) => sum + player.price * player.quantity,
    0
  );

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">📁 Your Portfolio</h2>
      <div className="mb-2 text-lg font-medium">
        💰 Portfolio Value: ${totalValue.toFixed(2)}
      </div>
      {portfolio.length === 0 ? (
        <p className="text-gray-600">You don't own any shares yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Shares</th>
                <th className="p-2">Price</th>
                <th className="p-2">Total</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((player) => (
                <tr key={player.id} className="border-t">
                  <td className="p-2">{player.name}</td>
                  <td className="p-2">{player.quantity}</td>
                  <td className="p-2">${player.price.toFixed(2)}</td>
                  <td className="p-2">
                    ${(player.price * player.quantity).toFixed(2)}
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => onSell(player.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs sm:text-sm"
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
