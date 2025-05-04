import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Game() {
  const canvasRef = useRef(null);
  const [launched, setLaunched] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [phaseComplete, setPhaseComplete] = useState(false);
  const [enemies, setEnemies] = useState([
    // 6 bolinhas inimigas iniciais
    {
      x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
      y: Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 2 - 1,
      radius: 10,
      color: "#ff0000",
    },
    {
      x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
      y: Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2,
      radius: 10,
      color: "#ff0000",
    },
    {
      x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
      y: Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2,
      radius: 10,
      color: "#ff0000",
    },
    {
      x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
      y: Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2,
      radius: 10,
      color: "#ff0000",
    },
    {
      x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
      y: Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2,
      radius: 10,
      color: "#ff0000",
    },
    {
      x: Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
      y: Math.random() * window.innerHeight * 0.8 + window.innerHeight * 0.1,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 4 - 2,
      radius: 10,
      color: "#ff0000",
    },
  ]);

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const initialPlanetRadius = 50;
  const initialDroneRadius = 12;

  const [planets, setPlanets] = useState([
    { x: screenWidth / 2, y: screenHeight / 2, radius: initialPlanetRadius, mass: 50, color: "#ff4500", angle: 0, type: "alien1" },
    { x: screenWidth / 2 + 300, y: screenHeight / 2 - 100, radius: initialPlanetRadius + 5, mass: 70, color: "#00b7eb", angle: 0, type: "alien2" },
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
  const [enemyImage, setEnemyImage] = useState(null);

  const G = 0.8;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const droneImg = new Image();
    droneImg.src = "/assets/gato1.jpg";
    droneImg.onload = () => setDroneImage(droneImg);
    droneImg.onerror = () => console.error("Erro ao carregar a imagem gato1.jpg. Verifique o caminho /assets/gato1.jpg");

    const finalImg = new Image();
    finalImg.src = "/assets/gato3.jpg";
    finalImg.onload = () => setFinalPlanetImage(finalImg);
    finalImg.onerror = () => console.error("Erro ao carregar a imagem gato3.jpg. Verifique o caminho /assets/gato3.jpg");

    const enemyImg = new Image();
    enemyImg.src = "/assets/alien.png";
    enemyImg.onload = () => setEnemyImage(enemyImg);
    enemyImg.onerror = () => console.error("Erro ao carregar a imagem alien.png. Verifique o caminho /assets/alien.png");

    function drawStars() {
      ctx.fillStyle = "#0a0a2a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 150; i++) {
        ctx.beginPath();
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2;
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(200, 200, 255, ${Math.random() * 0.8 + 0.2})`;
        ctx.fill();
      }
    }

    function drawPlanet(planet, index) {
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, planet.radius, 0, 2 * Math.PI);
      ctx.fillStyle = planet.color;
      ctx.fill();

      if (score === 49 && index === (currentPlanetIndex + 1) % planets.length) {
        const offset = planet.radius + 10;
        const x = planet.x + offset * Math.cos(planet.angle + 0.5);
        const y = planet.y + offset * Math.sin(planet.angle + 0.5);
        if (finalPlanetImage) {
          ctx.drawImage(finalPlanetImage, x - 10, y - 10, 40, 40);
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

    // Desenhar aliens
    function drawEnemies() {
      enemies.forEach(enemy => {
        if (enemyImage) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.radius, 0, 2 * Math.PI);
          ctx.clip();
          ctx.drawImage(
            enemyImage,
            enemy.x - enemy.radius,
            enemy.y - enemy.radius,
            enemy.radius * 2,
            enemy.radius * 2
          );
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, enemy.radius, 0, 2 * Math.PI);
          ctx.fillStyle = enemy.color;
          ctx.fill();
        }
      });
    }

    function update() {
      drawStars();
      drawEnemies();

      const updatedPlanets = [...planets];
      updatedPlanets[currentPlanetIndex].angle += 0.04;
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
              radius: Math.random() * 20 + 30,
              mass: Math.random() * 100 + 50,
              color: `hsl(${Math.random() * 360}, 70%, 50%)`,
              angle: 0,
              type: Math.random() < 0.5 ? "alien1" : "alien2",
            };
            const dx = newPlanet.x - nextPlanet.x;
            const dy = newPlanet.y - nextPlanet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 400 && distance < 600) break;
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
            if (updated >= 50) {
              setPhaseComplete(true);
              setLaunched(false);
            }
            return updated;
          });
        }
      }

      setEnemies(prev =>
        prev.map(enemy => {
          let x = enemy.x + enemy.vx;
          let y = enemy.y + enemy.vy;
          let vx = enemy.vx;
          let vy = enemy.vy;

          // Ricocheteio nas bordas
          if (x - enemy.radius < 0) {
            x = enemy.radius;
            vx = -vx;
          } else if (x + enemy.radius > screenWidth) {
            x = screenWidth - enemy.radius;
            vx = -vx;
          }
          if (y - enemy.radius < 0) {
            y = enemy.radius;
            vy = -vy;
          } else if (y + enemy.radius > screenHeight) {
            y = screenHeight - enemy.radius;
            vy = -vy;
          }

          if (launched) {
            const dx = drone.current.x - x;
            const dy = drone.current.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < drone.current.radius + enemy.radius) {
              console.log("Colisão com inimigo! Game Over");
              setGameOver(true);
              setLaunched(false);
            }
          }

          return { ...enemy, x, y, vx, vy };
        })
      );

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
  }, [launched, planets, droneImage, finalPlanetImage, enemies]);

  function launchDrone() {
    if (!launched && !phaseComplete) {
      const planet = planets[currentPlanetIndex];
      const speed = 8;
      drone.current.vx = speed * Math.cos(planet.angle);
      drone.current.vy = speed * Math.sin(planet.angle);
      setLaunched(true);
    }
  }

  function restartGame() {
    setScore(0);
    setGameOver(false);
    setPhaseComplete(false);
    setEnemies([
      // 6 bolinhas inimigas ao reiniciar
      {
        x: Math.random() * screenWidth * 0.8 + screenWidth * 0.1,
        y: Math.random() * screenHeight * 0.8 + screenHeight * 0.1,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        radius: 10,
        color: "#ff0000",
      },
      {
        x: Math.random() * screenWidth * 0.8 + screenWidth * 0.1,
        y: Math.random() * screenHeight * 0.8 + screenHeight * 0.1,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 - 2,
        radius: 10,
        color: "#ff0000",
      },
      {
        x: Math.random() * screenWidth * 0.8 + screenWidth * 0.1,
        y: Math.random() * screenHeight * 0.8 + screenHeight * 0.1,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 - 2,
        radius: 10,
        color: "#ff0000",
      },
      {
        x: Math.random() * screenWidth * 0.8 + screenWidth * 0.1,
        y: Math.random() * screenHeight * 0.8 + screenHeight * 0.1,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 - 2,
        radius: 10,
        color: "#ff0000",
      },
      {
        x: Math.random() * screenWidth * 0.8 + screenWidth * 0.1,
        y: Math.random() * screenHeight * 0.8 + screenHeight * 0.1,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 - 2,
        radius: 10,
        color: "#ff0000",
      },
      {
        x: Math.random() * screenWidth * 0.8 + screenWidth * 0.1,
        y: Math.random() * screenHeight * 0.8 + screenHeight * 0.1,
        vx: Math.random() * 4 - 2,
        vy: Math.random() * 4 - 2,
        radius: 10,
        color: "#ff0000",
      },
    ]);
    const resetPlanets = [
      { x: screenWidth / 2, y: screenHeight / 2, radius: initialPlanetRadius, mass: 50, color: "#ff4500", angle: 0, type: "alien1" },
      { x: screenWidth / 2 + 300, y: screenHeight / 2 - 100, radius: initialPlanetRadius + 5, mass: 70, color: "#00b7eb", angle: 0, type: "alien2" },
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
            Pontuação para vencer: 50
       </div>
      </div>
      <Link to="/menu" onClick={() => setIsNavigating(true)} className="absolute bottom-4 left-4 px-4 py-1 text-white text-base font-medium rounded-lg drop-shadow-md hover:underline">
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
            Você concluiu o jogo!
          </div>
          <div className="text-yellow-400 text-2xl font-bold mb-6 drop-shadow-md">
            Todos seus amigos foram encontrados!
          </div>
          <div className="flex justify-center gap-4">
            <button
              onClick={restartGame}
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