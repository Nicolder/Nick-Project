import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameProvider, useGame } from './context/GameContext';
import Home from './components/Home';
import BlindBox from './components/BlindBox';
import Scrapbook from './components/Scrapbook';

// Efeito Global de Clique Mágico
const ClickEffect = () => {
  const [clicks, setClicks] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      // Ignora cliques que sejam em botões se quisermos, mas como é pointer-events-none na div principal, tudo bem registrar
      const id = Date.now() + Math.random();
      setClicks((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      
      setTimeout(() => {
        setClicks((prev) => prev.filter((click) => click.id !== id));
      }, 1000);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]">
      <AnimatePresence>
        {clicks.map((click) => (
          <motion.div
            key={click.id}
            initial={{ opacity: 1, scale: 0.5, x: click.x - 10, y: click.y - 10 }}
            animate={{ opacity: 0, scale: 1.5, y: click.y - 60 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute text-twilight-yellow text-xl drop-shadow-[0_0_10px_#FCE792]"
          >
            ✨
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Barra Superior de Navegação (Estilo Noturno/Elegante)
const NavBar = ({ currentView, setCurrentView }) => {
  const { coins, inventory } = useGame();
  
  return (
    <nav className="w-full flex justify-between items-center p-6 md:px-12 relative z-50">
      <div className="font-heading text-3xl md:text-4xl text-twilight-cream drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] font-bold tracking-wide">
        Diário
      </div>
      
      <div className="flex gap-2 md:gap-4 bg-twilight-dark/50 backdrop-blur-md p-1.5 rounded-full border border-twilight-base shadow-lg">
        <button 
          onClick={() => setCurrentView('HOME')}
          className={`px-5 py-2.5 rounded-full font-sans font-bold text-xs md:text-sm transition-all duration-500 ease-out ${currentView === 'HOME' ? 'bg-twilight-base text-twilight-yellow shadow-md' : 'bg-transparent text-twilight-lavender hover:text-twilight-cream'}`}
        >
          Início
        </button>
        <button 
          onClick={() => setCurrentView('GASHAPON')}
          className={`px-5 py-2.5 rounded-full font-sans font-bold text-xs md:text-sm flex items-center gap-3 transition-all duration-500 ease-out ${currentView === 'GASHAPON' ? 'bg-twilight-base text-twilight-yellow shadow-md' : 'bg-transparent text-twilight-lavender hover:text-twilight-cream'}`}
        >
          <span className="hidden md:inline">Blind Box</span>
          <span className="bg-twilight-yellow text-twilight-darkest text-xs px-2.5 py-1 rounded-full font-extrabold shadow-[0_0_10px_rgba(252,231,146,0.3)]">{coins} 🪙</span>
        </button>
        <button 
          onClick={() => setCurrentView('SCRAPBOOK')}
          className={`px-5 py-2.5 rounded-full font-sans font-bold text-xs md:text-sm flex items-center gap-3 transition-all duration-500 ease-out ${currentView === 'SCRAPBOOK' ? 'bg-twilight-base text-twilight-yellow shadow-md' : 'bg-transparent text-twilight-lavender hover:text-twilight-cream'}`}
        >
          <span className="hidden md:inline">Diário</span>
          <span className="bg-twilight-darkest text-twilight-cream text-xs px-2.5 py-1 rounded-full border border-twilight-lavender/50">{inventory.length} 📖</span>
        </button>
      </div>
    </nav>
  );
};

// Layout Principal - Ambiente "Cozy Twilight"
const GameContent = () => {
  const [currentView, setCurrentView] = useState('HOME');

  return (
    <div className="min-h-screen w-full relative flex flex-col overflow-hidden bg-twilight-darkest selection:bg-twilight-lavender/30">
      
      {/* Luzes orgânicas respirando ao fundo (Calmas e lentas) */}
      <div className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-twilight-base/20 blur-[120px] animate-breathe pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-twilight-lavender/10 blur-[100px] animate-breathe pointer-events-none" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[30%] left-[40%] w-[40vw] h-[40vw] rounded-full bg-twilight-pink/5 blur-[90px] animate-float-slow pointer-events-none"></div>

      {/* Poeira estelar / Padrão de estrelas sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(252,231,146,0.03)_1px,transparent_1px)] bg-[length:50px_50px] pointer-events-none opacity-60"></div>

      <ClickEffect />

      <NavBar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="flex-1 w-full max-w-6xl mx-auto flex flex-col items-center mt-4 md:mt-10 p-4 relative z-10">
        {currentView === 'HOME' && <Home />}
        {currentView === 'GASHAPON' && <BlindBox />}
        {currentView === 'SCRAPBOOK' && <Scrapbook />}
      </main>
    </div>
  );
};

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
