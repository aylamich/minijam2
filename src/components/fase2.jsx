import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Fase2() {
  const canvasRef = useRef(null);
  const [lancado, setLancado] = useState(false);
  const [jogoTerminado, setJogoTerminado] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [faseConcluida, setFaseConcluida] = useState(false);

  const larguraTela = window.innerWidth;
  const alturaTela = window.innerHeight;

  const raioInicialPlaneta = 80;
  const raioInicialDrone = 16;

  const [planetas, setPlanetas] = useState([
    { x: larguraTela / 2, y: alturaTela / 2, radius: raioInicialPlaneta, mass: 50, color: "#ff3399", angle: 0, type: "alien1" },
    { x: larguraTela / 2 + 200, y: alturaTela / 2 - 100, radius: raioInicialPlaneta + 5, mass: 70, color: "#ff66cc", angle: 0, type: "alien2" },
  ]);
  const [indicePlanetaAtual, setIndicePlanetaAtual] = useState(0);

  const drone = useRef({
    x: planetas[0].x,
    y: planetas[0].y - planetas[0].radius - 20,
    vx: 0,
    vy: 0,
    radius: raioInicialDrone,
    color: "white",
  });

  const [imagemDrone, setImagemDrone] = useState(null);
  const [imagemPlanetaFinal, setImagemPlanetaFinal] = useState(null);

  const G = 0.8;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let idAnimacao;

    const imagemDroneObj = new Image();
    imagemDroneObj.src = "/assets/gato1.jpg";
    imagemDroneObj.onload = () => {
      setImagemDrone(imagemDroneObj);
    };

    const imagemFinal = new Image();
    imagemFinal.src = "/assets/gato3.jpg";
    imagemFinal.onload = () => {
      console.log("Imagem gato3.jpg carregada com sucesso");
      setImagemPlanetaFinal(imagemFinal);
    };
    imagemFinal.onerror = () => {
      console.error("Erro ao carregar a imagem gato3.jpg. Verifique o caminho /assets/gato3.jpg");
    };

    function desenharEstrelas() {
      ctx.fillStyle = "#ff99cc"; // Fundo em tom de rosa mais forte
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenhar estrelas para efeito de galaxia
      for (let i = 0; i < 100; i++) {
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const raio = Math.random() * 2;
        ctx.arc(x, y, raio, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`;
        ctx.fill();
      }
    }

    function desenharPlaneta(planeta, indice) {
      ctx.beginPath();
      ctx.arc(planeta.x, planeta.y, planeta.radius, 0, 2 * Math.PI);
      ctx.fillStyle = planeta.color;
      ctx.fill();

      if (pontuacao === 9 && indice === (indicePlanetaAtual + 1) % planetas.length) {
        const deslocamento = planeta.radius + 10;
        const x = planeta.x + deslocamento * Math.cos(planeta.angle + 0.5);
        const y = planeta.y + deslocamento * Math.sin(planeta.angle + 0.5);

        if (imagemPlanetaFinal) {
          ctx.drawImage(
            imagemPlanetaFinal,
            x - 10,
            y - 10,
            40,
            40
          );
        } else {
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = "yellow";
          ctx.fill();
        }
      }
    }

    function desenharDrone() {
      if (imagemDrone) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(drone.current.x, drone.current.y, drone.current.radius, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(
          imagemDrone,
          drone.current.x - drone.current.radius,
          drone.current.y - drone.current.radius,
          drone.current.radius * 2,
          drone.current.radius * 2
        );
        ctx.restore();
      }
    }

    function atualizar() {
      desenharEstrelas();

      const planetasAtualizados = [...planetas];
      planetasAtualizados[indicePlanetaAtual].angle += 0.02;
      setPlanetas(planetasAtualizados);

      planetas.forEach((planeta, indice) => desenharPlaneta(planeta, indice));

      if (lancado) {
        drone.current.x += drone.current.vx;
        drone.current.y += drone.current.vy;

        const proximoPlaneta = planetas[(indicePlanetaAtual + 1) % planetas.length];
        const dx = drone.current.x - proximoPlaneta.x;
        const dy = drone.current.y - proximoPlaneta.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < proximoPlaneta.radius + drone.current.radius) {
          const novoX = proximoPlaneta.x;
          const novoY = proximoPlaneta.y - proximoPlaneta.radius - 20;

          let novoPlaneta;
          let tentativas = 0;
          do {
            novoPlaneta = {
              x: Math.random() * larguraTela * 0.5 + larguraTela / 4,
              y: Math.random() * alturaTela * 0.4 + alturaTela / 4,
              radius: Math.random() * 30 + 50,
              mass: Math.random() * 100 + 50,
              color: `hsl(${Math.random() * 30 + 330}, 70%, 50%)`, // Apenas tons de rosa
              angle: 0,
              type: Math.random() < 0.5 ? "alien1" : "alien2",
            };
            const dx = novoPlaneta.x - proximoPlaneta.x;
            const dy = novoPlaneta.y - proximoPlaneta.y;
            const distancia = Math.sqrt(dx * dx + dy * dy);
            if (distancia > 300 && distancia < 500) break;
            tentativas++;
          } while (tentativas < 20);

          const novosPlanetas = [proximoPlaneta, novoPlaneta];
          setPlanetas(novosPlanetas);
          setIndicePlanetaAtual(0);
          setLancado(false);

          drone.current = {
            x: novoX,
            y: novoY,
            vx: 0,
            vy: 0,
            radius: raioInicialDrone,
            color: "white",
          };

          setPontuacao(prev => {
            const atualizado = prev + 1;
            if (atualizado >= 10) {
              setFaseConcluida(true);
              setLancado(false);
            }
            return atualizado;
          });
        }
      }

      if (
        drone.current.x < 0 ||
        drone.current.x > canvas.width ||
        drone.current.y < 0 ||
        drone.current.y > canvas.height
      ) {
        setJogoTerminado(true);
        setLancado(false);
      }

      if (!lancado) {
        const planeta = planetas[indicePlanetaAtual];
        const deslocamento = planeta.radius + 20;
        drone.current.x = planeta.x + deslocamento * Math.cos(planeta.angle);
        drone.current.y = planeta.y + deslocamento * Math.sin(planeta.angle);
      }

      desenharDrone();
      idAnimacao = requestAnimationFrame(atualizar);
    }

    idAnimacao = requestAnimationFrame(atualizar);
    canvas.addEventListener("click", lancarDrone);

    return () => {
      canvas.removeEventListener("click", lancarDrone);
      cancelAnimationFrame(idAnimacao);
    };
  }, [lancado, planetas, imagemDrone, imagemPlanetaFinal]);

  function lancarDrone() {
    if (!lancado && !faseConcluida) {
      const planeta = planetas[indicePlanetaAtual];
      const velocidade = 6;
      drone.current.vx = velocidade * Math.cos(planeta.angle);
      drone.current.vy = velocidade * Math.sin(planeta.angle);
      setLancado(true);
    }
  }

  function reiniciarJogo() {
    setPontuacao(0);
    setJogoTerminado(false);
    setFaseConcluida(false);
    const planetasReiniciados = [
      { x: larguraTela / 2, y: alturaTela / 2, radius: raioInicialPlaneta, mass: 50, color: "#ff3399", angle: 0, type: "alien1" },
      { x: larguraTela / 2 + 200, y: alturaTela / 2 - 100, radius: raioInicialPlaneta + 5, mass: 70, color: "#ff66cc", angle: 0, type: "alien2" },
    ];
    setPlanetas(planetasReiniciados);
    setIndicePlanetaAtual(0);
    setLancado(false);
    drone.current = {
      x: planetasReiniciados[0].x,
      y: planetasReiniciados[0].y - planetasReiniciados[0].radius - 20,
      vx: 0,
      vy: 0,
      radius: raioInicialDrone,
      color: "white",
    };
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <canvas ref={canvasRef} width={larguraTela} height={alturaTela} className="block" />
      <div className="absolute top-4 left-4 rounded-md px-2 py-1">
        <div className="text-white text-xl font-bold drop-shadow-md">
          Pontuacao: {pontuacao}
        </div>
        <div className="text-gray-200 text-lg font-medium drop-shadow-md">
          Pontuacao para vencer: 10
        </div>
      </div>
      <Link
        to="/menu"
        onClick={() => setNavegando(true)}
        className="absolute bottom-4 left-4 px-4 py-1 text-white text-base font-medium rounded-lg drop-shadow-md hover:underline"
      >
        Menu
      </Link>
      {jogoTerminado && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white bg-opacity-80 rounded-lg p-6">
          <div className="text-red-500 text-5xl font-extrabold mb-6">FIM DE JOGO</div>
          <button
            onClick={reiniciarJogo}
            className="px-8 py-3 bg-green-500 text-white text-xl rounded-xl hover:bg-green-600"
          >
            Reiniciar
          </button>
        </div>
      )}

      {faseConcluida && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-white bg-opacity-80 rounded-lg p-6">
          {imagemPlanetaFinal && (
            <img
              src={imagemPlanetaFinal.src}
              alt="Gato Amigo"
              className="mx-auto mb-4"
              style={{ width: "200px", height: "200px" }}
            />
          )}
          <div className="text-green-400 text-4xl font-bold mb-4 drop-shadow-md">
            Fase concluida com sucesso!
          </div>
          <div className="text-yellow-400 text-2xl font-bold mb-6 drop-shadow-md">
            Voce achou seu amigo!
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={reiniciarJogo}
              className="px-8 py-3 bg-red-400 text-white text-xl rounded-lg hover:bg-red-600 drop-shadow-md"
            >
              Jogar novamente
            </button>
            <Link
              to="/fase3"
              onClick={() => setNavegando(true)}
              className="px-8 py-3 bg-green-400 text-white text-xl rounded-lg hover:bg-green-600 drop-shadow-md"
            >
              Proxima Fase
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}