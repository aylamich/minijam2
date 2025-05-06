import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Jogo() {
  const referenciaCanvas = useRef(null);
  const [lancado, setLancado] = useState(false);
  const [jogoTerminado, setJogoTerminado] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [faseCompleta, setFaseCompleta] = useState(false);
  const [inimigos, setInimigos] = useState([
    // 6 bolinhas inimigas iniciais
    {
      x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
      y: Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 2 - 1,
      raio: 10,
      cor: "#ff0000",
    },
    {
      x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
      y: Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2,
      raio: 10,
      cor: "#ff0000",
    },
    {
      x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
      y: Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2,
      raio: 10,
      cor: "#ff0000",
    },
    {
      x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
      y: Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2,
      raio: 10,
      cor: "#ff0000",
    },
    {
      x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
      y: Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2,
      raio: 10,
      cor: "#ff0000",
    },
    {
      x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
      y: Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2,
      raio: 10,
      cor: "#ff0000",
    },
  ]);

  const larguraTela = window.innerWidth;
  const alturaTela = window.innerHeight;
  const raioInicialPlaneta = 50;
  const raioInicialDrone = 12;

  const [planetas, setPlanetas] = useState([
    { x: larguraTela / 2, y: alturaTela / 2, raio: raioInicialPlaneta, massa: 50, cor: "#ff4500", angulo: 0, tipo: "alien1" },
    { x: larguraTela / 2 + 300, y: alturaTela / 2 - 100, raio: raioInicialPlaneta + 5, massa: 70, cor: "#00b7eb", angulo: 0, tipo: "alien2" },
  ]);
  const [indicePlanetaAtual, setIndicePlanetaAtual] = useState(0);

  const drone = useRef({
    x: planetas[0].x,
    y: planetas[0].y - planetas[0].raio - 20,
    vx: 0,
    vy: 0,
    raio: raioInicialDrone,
    cor: "white",
  });

  const [imagemDrone, setImagemDrone] = useState(null);
  const [imagemPlanetaFinal, setImagemPlanetaFinal] = useState(null);
  const [imagemInimigo, setImagemInimigo] = useState(null);

  const G = 0.8;

  useEffect(() => {
    const canvas = referenciaCanvas.current;
    const ctx = canvas.getContext("2d");
    let idQuadroAnimacao;

    const imagemDrone = new Image();
    imagemDrone.src = "/assets/gato1.jpg";
    imagemDrone.onload = () => setImagemDrone(imagemDrone);
    imagemDrone.onerror = () => console.error("Erro ao carregar a imagem gato1.jpg. Verifique o caminho /assets/gato1.jpg");

    const imagemFinal = new Image();
    imagemFinal.src = "/assets/gato3.jpg";
    imagemFinal.onload = () => setImagemPlanetaFinal(imagemFinal);
    imagemFinal.onerror = () => console.error("Erro ao carregar a imagem gato3.jpg. Verifique o caminho /assets/gato3.jpg");

    const imagemInimigo = new Image();
    imagemInimigo.src = "/assets/alien.png";
    imagemInimigo.onload = () => setImagemInimigo(imagemInimigo);
    imagemInimigo.onerror = () => console.error("Erro ao carregar a imagem alien.png. Verifique o caminho /assets/alien.png");

    function desenharEstrelas() {
      ctx.fillStyle = "#0a0a2a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 150; i++) {
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const raio = Math.random() * 2;
        ctx.arc(x, y, raio, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(200, 200, 255, ${Math.random() * 0.8 + 0.2})`;
        ctx.fill();
      }
    }

    function desenharPlaneta(planeta, indice) {
      ctx.beginPath();
      ctx.arc(planeta.x, planeta.y, planeta.raio, 0, 2 * Math.PI);
      ctx.fillStyle = planeta.cor;
      ctx.fill();

      if (pontuacao === 49 && indice === (indicePlanetaAtual + 1) % planetas.length) {
        const deslocamento = planeta.raio + 10;
        const x = planeta.x + deslocamento * Math.cos(planeta.angulo + 0.5);
        const y = planeta.y + deslocamento * Math.sin(planeta.angulo + 0.5);
        if (imagemPlanetaFinal) {
          ctx.drawImage(imagemPlanetaFinal, x - 10, y - 10, 40, 40);
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
        ctx.arc(drone.current.x, drone.current.y, drone.current.raio, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(
          imagemDrone,
          drone.current.x - drone.current.raio,
          drone.current.y - drone.current.raio,
          drone.current.raio * 2,
          drone.current.raio * 2
        );
        ctx.restore();
      }
    }

    function desenharInimigos() {
      inimigos.forEach(inimigo => {
        if (imagemInimigo) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(inimigo.x, inimigo.y, inimigo.raio, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(
            imagemInimigo,
            inimigo.x - inimigo.raio,
            inimigo.y - inimigo.raio,
            inimigo.raio * 2,
            inimigo.raio * 2
          );
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(inimigo.x, inimigo.y, inimigo.raio, 0, 2 * Math.PI);
          ctx.fillStyle = inimigo.cor;
          ctx.fill();
        }
      });
    }

    function atualizar() {
      desenharEstrelas();
      desenharInimigos();

      const planetasAtualizados = [...planetas];
      planetasAtualizados[indicePlanetaAtual].angulo += 0.04;
      setPlanetas(planetasAtualizados);

      planetas.forEach((planeta, indice) => desenharPlaneta(planeta, indice));

      if (lancado) {
        drone.current.x += drone.current.vx;
        drone.current.y += drone.current.vy;

        const proximoPlaneta = planetas[(indicePlanetaAtual + 1) % planetas.length];
        const dx = drone.current.x - proximoPlaneta.x;
        const dy = drone.current.y - proximoPlaneta.y;
        const distancia = Math.sqrt(dx * dx + dy * dy);

        if (distancia < proximoPlaneta.raio + drone.current.raio) {
          const novoX = proximoPlaneta.x;
          const novoY = proximoPlaneta.y - proximoPlaneta.raio - 20;

          let novoPlaneta;
          let tentativas = 0;
          do {
            novoPlaneta = {
              x: Math.random() * larguraTela * 0.5 + larguraTela / 4,
              y: Math.random() * alturaTela * 0.4 + alturaTela / 4,
              raio: Math.random() * 20 + 30,
              massa: Math.random() * 100 + 50,
              cor: `hsl(${Math.random() * 360}, 70%, 50%)`,
              angulo: 0,
              tipo: Math.random() < 0.5 ? "alien1" : "alien2",
            };
            const dx = novoPlaneta.x - proximoPlaneta.x;
            const dy = novoPlaneta.y - proximoPlaneta.y;
            const distancia = Math.sqrt(dx * dx + dy * dy);
            if (distancia > 400 && distancia < 600) break;
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
            raio: raioInicialDrone,
            cor: "white",
          };

          setPontuacao(prev => {
            const atualizado = prev + 1;
            if (atualizado >= 50) {
              setFaseCompleta(true);
              setLancado(false);
            }
            return atualizado;
          });
        }
      }

      setInimigos(prev =>
        prev.map(inimigo => {
          let x = inimigo.x + inimigo.vx;
          let y = inimigo.y + inimigo.vy;
          let vx = inimigo.vx;
          let vy = inimigo.vy;

          if (x - inimigo.raio < 0) {
            x = inimigo.raio;
            vx = -vx;
          } else if (x + inimigo.raio > larguraTela) {
            x = larguraTela - inimigo.raio;
            vx = -vx;
          }
          if (y - inimigo.raio < 0) {
            y = inimigo.raio;
            vy = -vy;
          } else if (y + inimigo.raio > alturaTela) {
            y = alturaTela - inimigo.raio;
            vy = -vy;
          }

          if (lancado) {
            const dx = drone.current.x - x;
            const dy = drone.current.y - y;
            const distancia = Math.sqrt(dx * dx + dy * dy);
            if (distancia < drone.current.raio + inimigo.raio) {
              console.log("Colisao com inimigo! Jogo Terminado");
              setJogoTerminado(true);
              setLancado(false);
            }
          }

          return { ...inimigo, x, y, vx, vy };
        })
      );

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
        const deslocamento = planeta.raio + 20;
        drone.current.x = planeta.x + deslocamento * Math.cos(planeta.angulo);
        drone.current.y = planeta.y + deslocamento * Math.sin(planeta.angulo);
      }

      desenharDrone();
      idQuadroAnimacao = requestAnimationFrame(atualizar);
    }

    idQuadroAnimacao = requestAnimationFrame(atualizar);
    canvas.addEventListener("click", lancarDrone);

    return () => {
      canvas.removeEventListener("click", lancarDrone);
      cancelAnimationFrame(idQuadroAnimacao);
    };
  }, [lancado, planetas, imagemDrone, imagemPlanetaFinal, inimigos]);

  function lancarDrone() {
    if (!lancado && !faseCompleta) {
      const planeta = planetas[indicePlanetaAtual];
      const velocidade = 8;
      drone.current.vx = velocidade * Math.cos(planeta.angulo);
      drone.current.vy = velocidade * Math.sin(planeta.angulo);
      setLancado(true);
    }
  }

  function reiniciarJogo() {
    setPontuacao(0);
    setJogoTerminado(false);
    setFaseCompleta(false);
    setInimigos([
      // 6 bolinhas inimigas ao reiniciar
      {
        x: Math.random() * larguraTela * 0.8 + larguraTela * 0.1,
        y: Math.random() * alturaTela * 0.8 + alturaTela * 0.1,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        raio: 10,
        cor: "#ff0000",
      },
      {
        x: Math.random() * larguraTela * 0.8 + larguraTela * 0.1,
        y: Math.random() * alturaTela * 0.8 + alturaTela * 0.1,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 - 2,
        raio: 10,
        cor: "#ff0000",
      },
      {
        x: Math.random() * larguraTela * 0.8 + larguraTela * 0.1,
        y: Math.random() * alturaTela * 0.8 + alturaTela * 0.1,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 - 2,
        raio: 10,
        cor: "#ff0000",
      },
      {
        x: Math.random() * larguraTela * 0.8 + larguraTela * 0.1,
        y: Math.random() * alturaTela * 0.8 + alturaTela * 0.1,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 - 2,
        raio: 10,
        cor: "#ff0000",
      },
      {
        x: Math.random() * larguraTela * 0.8 + larguraTela * 0.1,
        y: Math.random() * alturaTela * 0.8 + alturaTela * 0.1,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 - 2,
        raio: 10,
        cor: "#ff0000",
      },
      {
        x: Math.random() * larguraTela * 0.8 + larguraTela * 0.1,
        y: Math.random() * alturaTela * 0.8 + alturaTela * 0.1,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 - 2,
        raio: 10,
        cor: "#ff0000",
      },
    ]);
    const planetasReiniciados = [
      { x: larguraTela / 2, y: alturaTela / 2, raio: raioInicialPlaneta, massa: 50, cor: "#ff4500", angulo: 0, tipo: "alien1" },
      { x: larguraTela / 2 + 300, y: alturaTela / 2 - 100, raio: raioInicialPlaneta + 5, massa: 70, cor: "#00b7eb", angulo: 0, tipo: "alien2" },
    ];
    setPlanetas(planetasReiniciados);
    setIndicePlanetaAtual(0);
    setLancado(false);
    drone.current = {
      x: planetasReiniciados[0].x,
      y: planetasReiniciados[0].y - planetasReiniciados[0].raio - 20,
      vx: 0,
      vy: 0,
      raio: raioInicialDrone,
      cor: "white",
    };
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <canvas ref={referenciaCanvas} width={larguraTela} height={alturaTela} className="block" />
      <div className="absolute top-4 left-4 rounded-md px-2 py-1">
        <div className="text-white text-xl font-bold drop-shadow-md">
          Pontuacao: {pontuacao}
        </div>
        <div className="text-gray-200 text-lg font-medium drop-shadow-md">
          Pontuacao para vencer: 50
        </div>
      </div>
      <Link to="/menu" onClick={() => setIsNavigating(true)} className="absolute bottom-4 left-4 px-4 py-1 text-white text-base font-medium rounded-lg drop-shadow-md hover:underline">
        Menu
      </Link>

      {jogoTerminado && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-black bg-opacity-80 rounded-lg p-6">
          <div className="text-red-500 text-5xl font-extrabold mb-6">JOGO TERMINADO</div>
          <button
            onClick={reiniciarJogo}
            className="px-8 py-3 bg-green-500 text-white text-xl rounded-xl hover:bg-green-600"
          >
            Reiniciar
          </button>
        </div>
      )}

      {faseCompleta && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-black bg-opacity-80 rounded-lg p-6">
          {imagemPlanetaFinal && (
            <img
              src={imagemPlanetaFinal.src}
              alt="Gato Amigo"
              className="mx-auto mb-4"
              style={{ width: "200px", height: "200px" }}
            />
          )}
          <div className="text-green-400 text-4xl font-bold mb-4 drop-shadow-md">
            Voce concluiu o jogo!
          </div>
          <div className="text-yellow-400 text-2xl font-bold mb-6 drop-shadow-md">
            Todos seus amigos foram encontrados!
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={reiniciarJogo}
              className="px-8 py-3 bg-red-400 text-white text-xl rounded-lg hover:bg-red-600 drop-shadow-md"
            >
              Jogar novamente
            </button>
            <Link
              to="/fase1"
              onClick={() => setIsNavigating(true)}
              className="px-8 py-3 bg-green-400 text-white text-xl rounded-lg hover:bg-green-600 drop-shadow-md"
            >
              Reiniciar
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}