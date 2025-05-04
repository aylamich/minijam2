import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Game() {
  const canvasRef = useRef(null);
  const [launched, setLaunched] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [phaseComplete, setPhaseComplete] = useState(false);

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const initialPlanetRadius = 80;
  const initialDroneRadius = 16;

  const [planets, setPlanets] = useState([
    { x: screenWidth / 2, y: screenHeight / 2, radius: initialPlanetRadius, mass: 50, color: "#ff3399", angle: 0, type: "alien1" },
    { x: screenWidth / 2 + 150, y: screenHeight / 2 - 80, radius: initialPlanetRadius + 5, mass: 70, color: "#ff66cc", angle: 0, type: "alien2" },
  ]);
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);

  const drone = useRef({
    x: planets[0].x,
    y: planets[0].y - planets[0].radius - 20,
    vx: 0,
    vy: 0,
    radius: initialDroneRadius,
    color: "white",
  });

  const [droneImage, setDroneImage] = useState(null);
  const [finalPlanetImage, setFinalPlanetImage] = useState(null);

  const G = 0.8;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const droneImg = new Image();
    droneImg.src = "/assets/gato1.jpg";
    droneImg.onload = () => {
      setDroneImage(droneImg);
    };

    const finalImg = new Image();
    finalImg.src = "/assets/gato2.jpg";
    finalImg.onload = () => {
      console.log("Imagem gato2.jpg carregada com sucesso");
      setFinalPlanetImage(finalImg);
    };
    finalImg.onerror = () => {
      console.error("Erro ao carregar a imagem gato2.jpg. Verifique o caminho /assets/gato2.jpg");
    };

    function drawStars() {
      ctx.fillStyle = "#000022"; // Fundo escuro de espaço
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenhar estrelas para efeito de espaço estrelado
      for (let i = 0; i < 150; i++) {
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 1.5;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
        ctx.fill();
      }
    }

    function drawPlanet(planet, index) {
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.radius, 0, 2 * Math.PI);
      ctx.fillStyle = planet.color;
      ctx.fill();

      if (score === 4 && index === (currentPlanetIndex + 1) % planets.length) {
        const offset = planet.radius + 10;
        const x = planet.x + offset * Math.cos(planet.angle + 0.5);
        const y = planet.y + offset * Math.sin(planet.angle + 0.5);

        if (finalPlanetImage) {
          ctx.drawImage(
            finalPlanetImage,
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

    function drawDrone() {
      if (droneImage) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(drone.current.x, drone.current.y, drone.current.radius, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(
          droneImage,
          drone.current.x - drone.current.radius,
          drone.current.y - drone.current.radius,
          drone.current.radius * 2,
          drone.current.radius * 2
        );
        ctx.restore();
      }
    }

    function update() {
      drawStars();

      const updatedPlanets = [...planets];
      updatedPlanets[currentPlanetIndex].angle += 0.01;
      setPlanets(updatedPlanets);

      planets.forEach((planet, index) => drawPlanet(planet, index));

      if (launched) {
        drone.current.x += drone.current.vx;
        drone.current.y += drone.current.vy;

        const nextPlanet = planets[(currentPlanetIndex + 1) % planets.length];
        const dx = drone.current.x - nextPlanet.x;
        const dy = drone.current.y - nextPlanet.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < nextPlanet.radius + drone.current.radius) {
          const newX = nextPlanet.x;
          const newY = nextPlanet.y - nextPlanet.radius - 20;

          let newPlanet;
          let attempts = 0;
          do {
            newPlanet = {
              x: Math.random() * screenWidth * 0.5 + screenWidth / 4,
              y: Math.random() * screenHeight * 0.4 + screenHeight / 4,
              radius: Math.random() * 30 + 50,
              mass: Math.random() * 100 + 50,
              color: `hsl(${Math.random() * 60 + 300}, 70%, 50%)`, // Tons de rosa e roxo
              angle: 0,
              type: Math.random() < 0.5 ? "alien1" : "alien2",
            };
            const dx = newPlanet.x - nextPlanet.x;
            const dy = newPlanet.y - nextPlanet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 200 && distance < 400) break;
            attempts++;
          } while (attempts < 20);

          const newPlanets = [nextPlanet, newPlanet];
          setPlanets(newPlanets);
          setCurrentPlanetIndex(0);
          setLaunched(false);

          drone.current = {
            x: newX,
            y: newY,
            vx: 0,
            vy: 0,
            radius: initialDroneRadius,
            color: "white",
          };

          setScore(prev => {
            const updated = prev + 1;
            if (updated >= 5) {
              setPhaseComplete(true);
              setLaunched(false);
            }
            return updated;
          });
        }
      }

      if (
        drone.current.x < 0 ||
        drone.current.x > canvas.width ||
        drone.current.y < 0 ||
        drone.current.y > canvas.height
      ) {
        setGameOver(true);
        setLaunched(false);
      }

      if (!launched) {
        const planet = planets[currentPlanetIndex];
        const offset = planet.radius + 20;
        drone.current.x = planet.x + offset * Math.cos(planet.angle);
        drone.current.y = planet.y + offset * Math.sin(planet.angle);
      }

      drawDrone();
      animationFrameId = requestAnimationFrame(update);
    }

    animationFrameId = requestAnimationFrame(update);
    canvas.addEventListener("click", launchDrone);

    return () => {
      canvas.removeEventListener("click", launchDrone);
      cancelAnimationFrame(animationFrameId);
    };
  }, [launched, planets, droneImage, finalPlanetImage]);

  function launchDrone() {
    if (!launched && !phaseComplete) {
      const planet = planets[currentPlanetIndex];
      const speed = 4;
      drone.current.vx = speed * Math.cos(planet.angle);
      drone.current.vy = speed * Math.sin(planet.angle);
      setLaunched(true);
    }
  }

  function restartGame() {
    setScore(0);
    setGameOver(false);
    setPhaseComplete(false);
    const resetPlanets = [
      { x: screenWidth / 2, y: screenHeight / 2, radius: initialPlanetRadius, mass: 50, color: "#ff3399", angle: 0, type: "alien1" },
      { x: screenWidth / 2 + 150, y: screenHeight / 2 - 80, radius: initialPlanetRadius + 5, mass: 70, color: "#ff66cc", angle: 0, type: "alien2" },
    ];
    setPlanets(resetPlanets);
    setCurrentPlanetIndex(0);
    setLaunched(false);
    drone.current = {
      x: resetPlanets[0].x,
      y: resetPlanets[0].y - resetPlanets[0].radius - 20,
      vx: 0,
      vy: 0,
      radius: initialDroneRadius,
      color: "white",
    };
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <canvas ref={canvasRef} width={screenWidth} height={screenHeight} className="block" />
      <div className="absolute top-4 left-4 rounded-md px-2 py-1">
        <div className="text-white text-xl font-bold drop-shadow-md">
          Pontuação: {score}
        </div>
        <div className="text-gray-200 text-lg font-medium drop-shadow-md">
          Pontuação para vencer: 5
        </div>
      </div>
      <Link
        to="/menu"
        onClick={() => setIsNavigating(true)}
        className="absolute bottom-4 left-4 px-4 py-1 text-white text-base font-medium rounded-lg drop-shadow-md hover:underline"
      >
        Menu
      </Link>
      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-black bg-opacity-80 rounded-lg p-6">
          <div className="text-red-500 text-5xl font-extrabold mb-6">GAME OVER</div>
          <button
            onClick={restartGame}
            className="px-8 py-3 bg-green-500 text-white text-xl rounded-xl hover:bg-green-600"
          >
            Reiniciar
          </button>
        </div>
      )}
      {phaseComplete && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center bg-black bg-opacity-80 rounded-lg p-6">
          {finalPlanetImage && (
            <img
              src={finalPlanetImage.src}
              alt="Gato Amigo"
              className="mx-auto mb-4"
              style={{ width: "200px", height: "200px" }}
            />
          )}
          <div className="text-green-400 text-4xl font-bold mb-4 drop-shadow-md">
            Fase concluída com sucesso!
          </div>
          <div className="text-yellow-400 text-2xl font-bold mb-6 drop-shadow-md">
            Você achou seu amigo!
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={restartGame}
              className="px-8 py-3 bg-red-400 text-white text-xl rounded-lg hover:bg-red-600 drop-shadow-md"
            >
              Jogar novamente
            </button>
            <Link
              to="/fase2"
              onClick={() => setIsNavigating(true)}
              className="px-8 py-3 bg-green-400 text-white text-xl rounded-lg hover:bg-green-600 drop-shadow-md"
            >
              Próxima Fase
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}