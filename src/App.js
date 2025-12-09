import React, { useState, useEffect } from "react";
import {
  RefreshCw,
  TrendingDown,
  ExternalLink,
  Clock,
  AlertCircle,
} from "lucide-react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

function App() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [cooldowns, setCooldowns] = useState({}); // Cooldowns por juego: { gameId: timestamp }

  // Cargar juegos al inicio
  useEffect(() => {
    fetchGames();
  }, []);

  // Actualizar cooldowns cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCooldowns((prev) => {
        const updated = { ...prev };
        let hasChanges = false;

        Object.keys(updated).forEach((gameId) => {
          const remaining = new Date(updated[gameId]) - new Date();
          if (remaining <= 0) {
            delete updated[gameId];
            hasChanges = true;
          }
        });

        return hasChanges ? updated : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/api/games`);
      setGames(response.data.data);

      if (response.data.data.length > 0 && !selectedGame) {
        setSelectedGame(response.data.data[0]);
      }
    } catch (err) {
      setError("Error al cargar los juegos. ¿Está el backend corriendo?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updatePrices = async () => {
    if (!selectedGame || updating) return;

    // Verificar cooldown del juego actual
    const gameCooldown = cooldowns[selectedGame.id];
    if (gameCooldown && new Date(gameCooldown) > new Date()) {
      const remaining = Math.ceil(
        (new Date(gameCooldown) - new Date()) / 1000 / 60
      );
      setError(`Este juego está en cooldown. Espera ${remaining} minutos.`);
      return;
    }

    setUpdating(true);
    setError(null);

    try {
      const response = await axios.post(
        `${API_URL}/api/games/${selectedGame.id}/update`
      );

      if (response.data.success) {
        // Actualizar el juego seleccionado con los nuevos precios
        const updatedGame = {
          ...selectedGame,
          prices: response.data.data.results.filter((r) => r.success),
          lastUpdate: new Date().toISOString(),
        };

        setSelectedGame(updatedGame);

        // Actualizar en la lista de juegos
        setGames(
          games.map((g) => (g.id === selectedGame.id ? updatedGame : g))
        );

        // Configurar cooldown SOLO para este juego
        setCooldowns((prev) => ({
          ...prev,
          [selectedGame.id]: response.data.data.nextUpdateAvailable,
        }));
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError(err.response.data.error);
        setCooldowns((prev) => ({
          ...prev,
          [selectedGame.id]: err.response.data.nextUpdateAvailable,
        }));
      } else {
        setError("Error al actualizar precios");
      }
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getRemainingCooldown = (gameId) => {
    const cooldownTime = cooldowns[gameId];
    if (!cooldownTime) return null;

    const remaining = new Date(cooldownTime) - new Date();
    if (remaining <= 0) return null;

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const getLowestPrice = (prices) => {
    if (!prices || prices.length === 0) return null;
    return prices.reduce((min, p) => (p.price < min.price ? p : min));
  };

  const remainingCooldown = selectedGame
    ? getRemainingCooldown(selectedGame.id)
    : null;
  const hasCooldown = remainingCooldown !== null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-2xl">Cargando juegos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🎮 CotizacionesPlay
          </h1>
          <p className="text-slate-300 text-lg">
            Compara precios de videojuegos PS4 y PS5 en Chile
          </p>
        </div>

        {/* Error global */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Selector de juegos */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-slate-700">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Selecciona un juego
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {games.map((game) => {
              const gameCooldown = getRemainingCooldown(game.id);
              const isSelected = selectedGame?.id === game.id;

              return (
                <button
                  key={game.id}
                  onClick={() => setSelectedGame(game)}
                  className={`p-4 rounded-xl transition-all relative ${
                    isSelected
                      ? "bg-purple-600 border-2 border-purple-400 transform scale-105"
                      : "bg-slate-700/50 border-2 border-transparent hover:border-slate-500"
                  }`}
                >
                  {gameCooldown && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {gameCooldown}
                    </div>
                  )}
                  <img
                    src={game.image}
                    alt={game.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className="text-white font-semibold text-sm">
                    {game.name}
                  </h3>
                  <span className="inline-block mt-2 px-3 py-1 bg-slate-600 rounded-full text-xs text-slate-200">
                    {game.platform}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {selectedGame && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Panel de control */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 sticky top-8">
                <img
                  src={selectedGame.image}
                  alt={selectedGame.name}
                  className="w-full rounded-xl mb-4"
                />
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedGame.name}
                </h2>
                <p className="text-slate-400 mb-4">{selectedGame.platform}</p>

                {selectedGame.lastUpdate && (
                  <div className="mb-4 flex items-center gap-2 text-slate-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>
                      Última actualización:{" "}
                      {new Date(selectedGame.lastUpdate).toLocaleTimeString(
                        "es-CL"
                      )}
                    </span>
                  </div>
                )}

                <button
                  onClick={updatePrices}
                  disabled={updating || hasCooldown}
                  className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                    updating || hasCooldown
                      ? "bg-slate-600 cursor-not-allowed text-slate-400"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  }`}
                >
                  <RefreshCw
                    className={`w-5 h-5 ${updating ? "animate-spin" : ""}`}
                  />
                  {updating
                    ? "Actualizando..."
                    : hasCooldown
                    ? `Espera ${remainingCooldown}`
                    : "Actualizar Precios"}
                </button>
              </div>
            </div>

            {/* Comparación de precios */}
            <div className="lg:col-span-2">
              {selectedGame.prices && selectedGame.prices.length > 0 ? (
                <>
                  <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-6">
                    <h3 className="text-2xl font-bold text-white mb-6">
                      Precios actuales
                    </h3>

                    <div className="space-y-4">
                      {selectedGame.prices.map((priceInfo, idx) => {
                        const isLowest =
                          getLowestPrice(selectedGame.prices)?.store ===
                          priceInfo.store;

                        return (
                          <div
                            key={idx}
                            className={`p-6 rounded-xl border-2 transition-all ${
                              isLowest
                                ? "bg-green-900/20 border-green-500"
                                : "bg-slate-700/30 border-slate-600"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="text-xl font-semibold text-white flex items-center gap-2 capitalize">
                                  {priceInfo.store}
                                  {isLowest && (
                                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full flex items-center gap-1">
                                      <TrendingDown className="w-3 h-3" />
                                      Mejor precio
                                    </span>
                                  )}
                                </h4>
                              </div>
                              <div className="text-right">
                                <p className="text-3xl font-bold text-white">
                                  {formatPrice(priceInfo.price)}
                                </p>
                              </div>
                            </div>

                            <a
                              href={priceInfo.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              Ver en tienda
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Análisis */}
                  {selectedGame.prices.length >= 2 && (
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                      <h3 className="text-xl font-bold text-white mb-4">
                        Análisis de precios
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                          <p className="text-slate-400 text-sm mb-1">
                            Diferencia
                          </p>
                          <p className="text-2xl font-bold text-orange-400">
                            {formatPrice(
                              Math.max(
                                ...selectedGame.prices.map((p) => p.price)
                              ) -
                                Math.min(
                                  ...selectedGame.prices.map((p) => p.price)
                                )
                            )}
                          </p>
                        </div>
                        <div className="bg-slate-700/50 p-4 rounded-lg">
                          <p className="text-slate-400 text-sm mb-1">
                            Ahorro potencial
                          </p>
                          <p className="text-2xl font-bold text-green-400">
                            {(
                              ((Math.max(
                                ...selectedGame.prices.map((p) => p.price)
                              ) -
                                Math.min(
                                  ...selectedGame.prices.map((p) => p.price)
                                )) /
                                Math.max(
                                  ...selectedGame.prices.map((p) => p.price)
                                )) *
                              100
                            ).toFixed(1)}
                            %
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-12 border border-slate-700 text-center">
                  <p className="text-slate-400 text-lg mb-4">
                    No hay precios disponibles aún
                  </p>
                  <p className="text-slate-500 text-sm">
                    Haz clic en "Actualizar Precios" para obtener los precios
                    actuales
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
