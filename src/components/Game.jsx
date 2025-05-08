import { useEffect, useRef, useState, useCallback } from "react";

export default function Game() {
  const canvasRef = useRef(null);
  const [launched, setLaunched] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);

  const planetsRef = useRef([
    { x: 400, y: 300, radius: 40, mass: 50, color: "blue", angle: 0 },
    { x: 650, y: 200, radius: 60, mass: 100, color: "orange", angle: 0 },
  ]);

  const drone = useRef({
    x: planetsRef.current[0].x,
    y: planetsRef.current[0].y - planetsRef.current[0].radius - 10,
    vx: 0,
    vy: 0,
    radius: 8,
    color: "white",
  });

  const G = 0.8;

  const launchDrone = useCallback(() => {
    if (!launched) {
      const planet = planetsRef.current[currentPlanetIndex];
      const speed = 5;
      drone.current.vx = speed * Math.cos(planet.angle);
      drone.current.vy = speed * Math.sin(planet.angle);
      setLaunched(true);
    }
  }, [launched, currentPlanetIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    function drawPlanet(planet) {
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.radius, 0, 2 * Math.PI);
      ctx.fillStyle = planet.color;
      ctx.fill();
    }

    function drawDrone() {
      ctx.beginPath();
      ctx.arc(drone.current.x, drone.current.y, drone.current.radius, 0, 2 * Math.PI);
      ctx.fillStyle = drone.current.color;
      ctx.fill();
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Atualiza o ângulo de rotação do planeta atual
      planetsRef.current[currentPlanetIndex].angle += 0.03;

      // Desenha os planetas
      planetsRef.current.forEach(drawPlanet);

      if (launched) {
        drone.current.x += drone.current.vx;
        drone.current.y += drone.current.vy;

        // Verifica colisão com o próximo planeta
        const nextPlanet = planetsRef.current[(currentPlanetIndex + 1) % planetsRef.current.length];
        const dx = drone.current.x - nextPlanet.x;
        const dy = drone.current.y - nextPlanet.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < nextPlanet.radius + drone.current.radius) {
          // Atualiza a posição do drone para o novo planeta
          const newX = nextPlanet.x;
          const newY = nextPlanet.y - nextPlanet.radius - 10;

          const newPlanet = {
            x: Math.random() * 600 + 100,
            y: Math.random() * 400 + 100,
            radius: Math.random() * 20 + 30,
            mass: Math.random() * 100 + 50,
            color: `hsl(${Math.random() * 360}, 80%, 50%)`,
            angle: 0,
          };

          planetsRef.current = [nextPlanet, newPlanet];
          setCurrentPlanetIndex(0);
          setLaunched(false);

          drone.current = {
            x: newX,
            y: newY,
            vx: 0,
            vy: 0,
            radius: 8,
            color: "white",
          };

          setScore((prev) => prev + 1);
        }
      }

      // Verifica se o drone saiu da tela
      if (
        drone.current.x < 0 ||
        drone.current.x > canvas.width ||
        drone.current.y < 0 ||
        drone.current.y > canvas.height
      ) {
        setGameOver(true);
        setLaunched(false);
      }

      // Se não lançado, atualiza a posição baseada na rotação
      if (!launched) {
        const planet = planetsRef.current[currentPlanetIndex];
        const offset = planet.radius + 10;
        drone.current.x = planet.x + offset * Math.cos(planet.angle);
        drone.current.y = planet.y + offset * Math.sin(planet.angle);
      }

      drawDrone();
      animationFrameId = requestAnimationFrame(update);
    }

    animationFrameId = requestAnimationFrame(update);
    canvas.addEventListener("click", launchDrone);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("click", launchDrone);
    };
  }, [launched, currentPlanetIndex, launchDrone]);

  function resetGame() {
    const initialPlanets = [
      { x: 400, y: 300, radius: 40, mass: 50, color: "blue", angle: 0 },
      { x: 650, y: 200, radius: 60, mass: 100, color: "orange", angle: 0 },
    ];

    planetsRef.current = initialPlanets;
    drone.current = {
      x: initialPlanets[0].x,
      y: initialPlanets[0].y - initialPlanets[0].radius - 10,
      vx: 0,
      vy: 0,
      radius: 8,
      color: "white",
    };

    setCurrentPlanetIndex(0);
    setLaunched(false);
    setGameOver(false);
    setScore(0);
  }

  return (
    <div className="flex flex-col items-center mt-4 relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-white bg-black"
      />

      {/* Exibe a pontuação */}
      <div className="absolute top-4 left-4 text-white text-xl">
        Pontuação: {score}
      </div>

      {/* Mensagem de Game Over */}
      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-red-500 text-xl font-bold mb-4">Game Over</div>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
          >
            Reiniciar
          </button>
        </div>
      )}
    </div>
  );
}

