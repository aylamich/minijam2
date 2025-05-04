import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Menu = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      alpha: Math.random(),
      delta: Math.random() * 0.02,
    }));

    const drawStars = () => {
      // Definir fundo escuro do tema galáxia
      ctx.fillStyle = '#0a0a2a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Desenhar estrelas
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
        star.alpha += star.delta;
        if (star.alpha <= 0 || star.alpha >= 1) star.delta *= -1;
      }
      requestAnimationFrame(drawStars);
    };

    drawStars();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-4xl font-bold mb-10 text-white drop-shadow-lg">
          Selecione a Fase
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <Link to="/fase1" className="flex flex-col items-center hover:scale-105 transition">
            <img
              src="/assets/gato2.jpg"
              alt="Fase 1"
              className="w-24 h-24 rounded-lg mb-2 border border-white"
            />
            <span className="text-white drop-shadow-md">Fase 1</span>
          </Link>
          <Link to="/fase2" className="flex flex-col items-center hover:scale-105 transition">
            <img
              src="/assets/gato3.jpg"
              alt="Fase 2"
              className="w-24 h-24 rounded-lg mb-2 border border-white"
            />
            <span className="text-white drop-shadow-md">Fase 2</span>
          </Link>
          <Link to="/fase3" className="flex flex-col items-center hover:scale-105 transition">
            <img
              src="/assets/gato4.jpg"
              alt="Fase 3"
              className="w-24 h-24 rounded-lg mb-2 border border-white"
            />
            <span className="text-white drop-shadow-md">Fase 3</span>
          </Link>
          <Link to="/fase4" className="flex flex-col items-center hover:scale-105 transition">
            <img
              src="/assets/gato5.jpg"
              alt="Fase 4"
              className="w-24 h-24 rounded-lg mb-2 border border-white"
            />
            <span className="text-white drop-shadow-md">Fase 4</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Menu;