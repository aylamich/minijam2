import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Inicio() {
  const [isFading, setIsFading] = useState(false);
  const navigate = useNavigate();

  const handleJogarClick = (e) => {
    e.preventDefault();
    setIsFading(true);
    setTimeout(() => {
      navigate("/introducao");
    }, 500); 
  };

  return (
    <div
      className={`relative w-screen h-screen bg-[#0a0a2a] overflow-hidden flex flex-col items-center justify-center transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100" // Fade in
      }`}
    >
      {/* Fundo estelar */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.2,
              animation: `twinkle ${Math.random() * 3 + 2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Título do jogo */}
      <h1 className="text-6xl md:text-8xl font-bold text-white font-orbitron text-center mb-12 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10">
        Gato Orbital
      </h1>

      {/* Botão Jogar */}
      <Link
        to="/introducao"
        onClick={handleJogarClick}
        className="px-8 py-4 bg-green-500 text-white text-2xl font-bold rounded-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(0,255,0,0.8)] z-10"
      >
        Jogar
      </Link>

      {/* Estilos globais para animação */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');
        .font-orbitron {
          font-family: 'Orbitron', sans-serif;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}