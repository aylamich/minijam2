import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function Introducao() {
  const [indiceFala, setIndiceFala] = useState(0);
  const [estaAparecendo, setEstaAparecendo] = useState(false);
  const [textoExibido, setTextoExibido] = useState("");
  const [digitando, setDigitando] = useState(true); // Controla se está digitando
  const canvasRef = useRef(null);

  // Falas do gato
  const falas = [
    "Oi, eu sou o Gato! Eu e meus amigos vivíamos felizes na Terra até que algo inesperado aconteceu...",
    "Uma noite, aliens invadiram nosso lar com uma nave gigante! De repente, estávamos no espaço.",
    "No espaço, fomos separados e nos perdemos entre as estrelas. Estou sozinho agora.",
    "Mas não vou desistir! Vou viajar pelos planetas, encontrar meus amigos e salvar todos eles!"
  ];

  // Efeito de digitação
  useEffect(() => {
    setTextoExibido(""); // Reseta o texto
    setDigitando(true); // Inicia a digitação
    const textoAtual = falas[indiceFala] || ""; // Garante que não haja undefined
    let index = 0;

    const intervalo = setInterval(() => {
      if (index < textoAtual.length) {
        setTextoExibido(textoAtual.slice(0, index + 1)); // Constrói o texto letra por letra
        index++;
      } else {
        setDigitando(false); // Termina a digitação
        clearInterval(intervalo);
      }
    }, 50); // Velocidade da digitação (50ms por letra)

    return () => clearInterval(intervalo); // Limpa o intervalo
  }, [indiceFala]);

  const handleFalaClick = () => {
    if (digitando) {
      // Se estiver digitando, completa o texto imediatamente
      setTextoExibido(falas[indiceFala]);
      setDigitando(false);
    } else {
      // Se a digitação terminou, avança para a próxima fala
      console.log("Clicou no balão, indiceFala:", indiceFala + 1);
      setIndiceFala((prev) => prev + 1);
    }
  };

  // Efeito de aparecimento ao carregar a página
  useEffect(() => {
    setEstaAparecendo(true);
  }, []);

  return (
    <div
      className={`relative w-screen h-screen bg-[#0a0a2a] overflow-hidden transition-opacity duration-500 ${
        estaAparecendo ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Fundo estelar */}
      <div className="absolute inset-0 z-0">
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
              animation: `cintilar ${Math.random() * 3 + 2}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Gato Principal */}
      <img
        src="/assets/gato.png"
        alt="Gato Orbital"
        className="absolute left-0 top-0 w-1/2 h-full object-cover z-10"
        onError={() => console.error("Erro ao carregar gato.png")}
      />

      {/* Balão de Fala e Botão Iniciar */}
      {indiceFala < falas.length ? (
        <div
          className="absolute bottom-8 right-8 w-[50%] md:w-[45%] bg-white bg-opacity-80 text-black text-xl md:text-2xl font-bold p-6 rounded-lg cursor-pointer z-20"
          onClick={handleFalaClick}
        >
          {textoExibido}
          {/* Cauda do balão (apontando para a esquerda, em direção ao gato) */}
          <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white border-opacity-80" />
        </div>
      ) : (
        <Link
          to="/fase1"
          className="absolute bottom-36 right-8 w-[25%] md:w-[45%] bg-blue-500 text-white text-xl md:text-2xl font-bold p-6 rounded-lg hover:scale-110 transition-all duration-300 drop-shadow-[0_0_10px_rgba(0,191,255,0.8)] z-20 text-center"
        >
          Iniciar
        </Link>
      )}

      {/* Animação da nave abduzindo gatos */}
      {indiceFala === 1 && (
        <div className="absolute top-4 right-1/4 z-25">
          <img
            src="/assets/nave.png"
            alt="Nave Alien"
            className="w-32 h-32 object-contain"
            style={{ animation: `entrada-nave 1s ease-in-out` }}
            onError={() => console.error("Erro ao carregar nave.png")}
          />
          <div
            className="absolute top-18 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[120px] border-l-transparent border-r-transparent border-b-green-400 border-opacity-50"
            style={{ animation: `luz 1.5s infinite` }}
          />
          {/* Gatos sendo abduzidos */}
          {["gato1", "gato2", "gato3", "gato4", "gato5"].map((gato, i) => (
            <img
              key={gato}
              src={`/assets/${gato}.jpg`}
              alt={`Gato ${i + 1}`}
              className="absolute w-10 h-10 object-cover rounded-full"
              style={{
                top: `${120 + i * 20}px`,
                left: `${24 + (i % 2) * 20}px`,
                animation: `abducao 2s ease-in ${i * 0.3}s forwards`
              }}
              onError={() => console.error(`Erro ao carregar ${gato}.jpg`)}
            />
          ))}
          {/* Mini aliens voando ao redor da nave */}
          {[...Array(5)].map((_, i) => (
            <img
              key={`alien-${i}`}
              src="/assets/alien.png"
              alt={`Mini Alien ${i + 1}`}
              className="absolute w-8 h-8 object-contain"
              style={{
                top: `${60 + (i % 2) * 40}px`,
                left: `${i % 2 === 0 ? -40 : 140}px`,
                animation: `voo-alien 1.5s ease-in-out ${i * 0.2}s infinite alternate`
              }}
              onError={() => console.error("Erro ao carregar alien.png")}
            />
          ))}
        </div>
      )}

      {/* Estilos globais para animações */}
      <style jsx global>{`
        @keyframes cintilar {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        @keyframes entrada-nave {
          0% { transform: translateY(-100px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes luz {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @keyframes abducao {
          0% { transform: translateY(0); opacity: 1; }
          80% { transform: translateY(-80px); opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
        @keyframes voo-alien {
          0% { transform: translateY(-20px); }
          100% { transform: translateY(20px); }
        }
      `}</style>
    </div>
  );
}