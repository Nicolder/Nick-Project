import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { Fish, Feather, HandHeart, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

const CATS_DATA = [
  { id: 'pitanguinha', name: "Pitanguinha", img: "/assets/cats/pitanguinha.png", color: "from-[#2A2A2A] to-[#0D0D0D]" },
  { id: 'lice', name: "Lice", img: "/assets/cats/lice.png", color: "from-[#FFFFFF] to-[#E0E0E0]" },
  { id: 'camomila', name: "Camomila", img: "/assets/cats/camomila.png", color: "from-[#FFD54F] to-[#FF8F00]" },
  { id: 'neva', name: "Neva", img: "/assets/cats/neva.png", color: "from-[#CFD8DC] to-[#90A4AE]" }
];

const NEEDS = [
  { id: 'food', icon: Fish, color: 'text-[#EAA9B8]', label: 'Fome' },
  { id: 'play', icon: Feather, color: 'text-[#B5A8D5]', label: 'Brincar' },
  { id: 'pet', icon: HandHeart, color: 'text-[#FDE481]', label: 'Carinho' }
];

// As três posições fixas na sala (Almofadas)
const CUSHION_SPOTS = [
  { id: 1, name: "Almofada Esquerda", left: "20%" },
  { id: 2, name: "Tapete Central", left: "50%" },
  { id: 3, name: "Cama Direita", left: "80%" }
];

const ActiveCat = ({ cat, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(100);
  const [isSatisfied, setIsSatisfied] = useState(false);
  const NeedIcon = NEEDS.find(n => n.id === cat.need)?.icon;
  const needColor = NEEDS.find(n => n.id === cat.need)?.color;

  // Escuta se este gato foi marcado como satisfeito
  useEffect(() => {
    if (cat.satisfied) {
      setIsSatisfied(true);
    }
  }, [cat.satisfied]);

  useEffect(() => {
    if (isSatisfied) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 2) {
          clearInterval(timer);
          onTimeout(cat.instanceId);
          return 0;
        }
        return prev - 1.5;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [cat.instanceId, onTimeout, isSatisfied]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: isSatisfied ? 1.2 : 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.5, opacity: 0, filter: 'blur(10px)', y: -50 }}
      transition={{ type: "spring", bounce: 0.5, duration: isSatisfied ? 0.8 : 0.5 }}
      // Fixed size container (160x160px)
      className={`absolute w-40 h-40 z-10 cat-hitbox ${isSatisfied ? 'pointer-events-none' : ''}`}
      // USAMOS MARGIN NEGATIVA AO INVÉS DE TRANSFORM. 
      // Framer Motion zera o `transform` customizado quando anima `y` e `scale`.
      // Usar margins negativas resolve o alinhamento sem brigar com a biblioteca! w-40 = 160px -> margin = -80px.
      style={{ left: cat.spot.left, top: "50%", marginLeft: "-80px", marginTop: "-80px" }}
      data-cat-instance={cat.instanceId}
      data-cat-need={cat.need}
    >
      {/* Almofada Base (Preta) perfeitamente alinhada no fundo do container */}
      <div className={`absolute bottom-0 left-0 w-40 h-16 rounded-[100%] bg-black/60 shadow-[0_10px_20px_rgba(0,0,0,0.5)] border-t border-white/10 transition-all duration-500 ${isSatisfied ? 'opacity-0' : 'opacity-100'} z-0`}></div>

      {/* Balão de Necessidade */}
      <AnimatePresence>
        {!isSatisfied && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-glass flex flex-col items-center gap-2 z-30"
          >
            <NeedIcon size={24} className={`${needColor} drop-shadow-md animate-pulse`} />
            <div className="w-12 h-1.5 bg-black/40 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-100 linear ${timeLeft > 50 ? 'bg-[#FDE481]' : timeLeft > 25 ? 'bg-[#EAA9B8]' : 'bg-red-500'}`}
                style={{ width: `${timeLeft}%` }}
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/10 border-r border-b border-white/20 rotate-45 backdrop-blur-md"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback de Sucesso */}
      <AnimatePresence>
        {isSatisfied && (
          <motion.div
            initial={{ scale: 0, y: 0 }}
            animate={{ scale: [0, 1.5, 1], y: -50 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 -translate-x-1/2 top-0 z-50 flex flex-col items-center pointer-events-none"
          >
            <CheckCircle2 size={60} className="text-[#FDE481] drop-shadow-[0_0_30px_rgba(253,228,129,1)] bg-black/50 rounded-full" />
            <span className="text-xl sm:text-2xl font-black text-white drop-shadow-lg mt-2 whitespace-nowrap">+1 Ficha!</span>

            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    x: (Math.random() - 0.5) * 150,
                    y: (Math.random() - 0.5) * 150
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute text-3xl drop-shadow-[0_0_15px_#EAA9B8]"
                >
                  💖
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aura */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full bg-gradient-to-br ${cat.color} blur-[25px] transition-all duration-500 ${isSatisfied ? 'opacity-80 scale-125' : 'opacity-30 animate-pulse'} z-10`}></div>

      {/* Gato Container Fixo */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-2 transition-colors duration-500 bg-gradient-to-br ${cat.color} ${isSatisfied ? 'border-[#FDE481]' : 'border-white/10'} z-20`}>
        {/* Imagem do Gato animada com Framer Motion (Pirueta) */}
        <motion.div
          className="w-full h-full rounded-full overflow-hidden relative"
          animate={isSatisfied ? { rotate: [0, 360], y: [0, -30, 0], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <img src={cat.img} alt={cat.name} className="w-full h-full object-cover opacity-90 drop-shadow-2xl" />
          {isSatisfied && <div className="absolute inset-0 bg-white/40 mix-blend-overlay"></div>}
        </motion.div>
      </div>

      {/* Shockwave Épica Radial (Aparece atrás do gato) */}
      <AnimatePresence>
        {isSatisfied && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-[10px] border-[#FDE481] z-10 pointer-events-none drop-shadow-[0_0_20px_#FDE481]"
          />
        )}
      </AnimatePresence>

      {/* Nome */}
      <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-bold tracking-widest uppercase text-twilight-cream px-4 py-1.5 rounded-full backdrop-blur-sm border transition-colors ${isSatisfied ? 'bg-[#FDE481]/20 border-[#FDE481]/50 text-[#FDE481] scale-110' : 'bg-black/50 border-white/10'} z-30 whitespace-nowrap`}>
        {cat.name}
      </span>
    </motion.div>
  );
};

const Tool = ({ tool, onDragEnd }) => {
  const Icon = tool.icon;
  return (
    <motion.div
      drag
      dragSnapToOrigin
      whileDrag={{ scale: 1.2, zIndex: 50 }}
      whileHover={{ scale: 1.1 }}
      onDragEnd={(e, info) => onDragEnd(e, info, tool.id)}
      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10 shadow-glass-inner flex flex-col items-center justify-center cursor-grab active:cursor-grabbing group touch-none"
    >
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-2xl"></div>
      <Icon size={32} className={`${tool.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] mb-1`} />
      <span className="text-[9px] font-sans font-bold text-white/50 uppercase tracking-widest">{tool.label}</span>
    </motion.div>
  );
};

const Home = () => {
  const { coins, addCoin } = useGame();
  const [activeCats, setActiveCats] = useState([]);

  // Game Loop
  useEffect(() => {
    const spawnCat = () => {
      // 1. Não usar a mesma almofada duas vezes simultaneamente
      const occupiedSpots = activeCats.map(c => c.spot.id);
      const freeSpots = CUSHION_SPOTS.filter(spot => !occupiedSpots.includes(spot.id));

      if (freeSpots.length === 0) return;
      if (activeCats.length >= 2 && Math.random() > 0.2) return;

      // 2. Não spawnar um gato que JÁ ESTÁ NA TELA
      const activeCatIds = activeCats.map(c => c.id);
      const availableCats = CATS_DATA.filter(cat => !activeCatIds.includes(cat.id));

      // Se por um milagre todos os 4 gatos estiverem na tela (impossível pois só tem 3 almofadas), retorna
      if (availableCats.length === 0) return;

      const randomSpot = freeSpots[Math.floor(Math.random() * freeSpots.length)];
      const randomCat = availableCats[Math.floor(Math.random() * availableCats.length)];
      const randomNeed = NEEDS[Math.floor(Math.random() * NEEDS.length)];

      const newCat = {
        ...randomCat,
        need: randomNeed.id,
        spot: randomSpot,
        instanceId: Date.now() + Math.random(),
        satisfied: false
      };

      setActiveCats(prev => [...prev, newCat]);
    };

    const interval = setInterval(() => {
      const chance = activeCats.length === 0 ? 0.8 : 0.3;
      if (Math.random() < chance) spawnCat();
    }, 4000);

    spawnCat();
    return () => clearInterval(interval);
  }, [activeCats]);

  const removeCat = (instanceId) => {
    setActiveCats(prev => prev.filter(c => c.instanceId !== instanceId));
  };

  const handleToolDragEnd = (event, info, toolId) => {
    const dropTarget = document.elementFromPoint(info.point.x, info.point.y);
    const catElement = dropTarget?.closest('.cat-hitbox');

    if (catElement) {
      const catInstance = catElement.getAttribute('data-cat-instance');
      const catNeed = catElement.getAttribute('data-cat-need');

      const cat = activeCats.find(c => c.instanceId === catInstance);
      if (cat?.satisfied) return;

      if (catNeed === toolId) {
        setActiveCats(prev => prev.map(c =>
          c.instanceId === catInstance ? { ...c, satisfied: true } : c
        ));
        addCoin();

        // Explosão Moderada de Confetti
        const rect = catElement.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        confetti({
          particleCount: 40,
          spread: 80,
          startVelocity: 30,
          origin: { x, y },
          colors: ['#FDE481', '#EAA9B8', '#B5A8D5', '#FFFFFF'],
          zIndex: 9999,
          gravity: 0.8,
          disableForReducedMotion: true
        });

        setTimeout(() => removeCat(catInstance), 2000);
      } else {
        catElement.animate([
          { transform: 'translate(-50%, -50%) translateX(0px)' },
          { transform: 'translate(-50%, -50%) translateX(-15px)' },
          { transform: 'translate(-50%, -50%) translateX(15px)' },
          { transform: 'translate(-50%, -50%) translateX(0px)' }
        ], { duration: 300 });
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-between h-[85vh] relative mt-4">

      {/* Header Premium */}
      <div className="w-full max-w-5xl flex justify-between items-start z-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel px-6 py-5 md:px-8 md:py-6 rounded-[2rem] max-w-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border-b border-r border-white/5"
        >
          <h1 className="font-heading text-3xl md:text-5xl text-twilight-cream font-bold mb-2 md:mb-3 leading-tight drop-shadow-md">
            Nossos <span className="text-transparent bg-clip-text bg-gradient-to-r from-twilight-yellow to-twilight-pink italic">Gatinhos</span>
          </h1>
          <p className="font-sans text-twilight-lavender text-xs md:text-sm leading-relaxed max-w-md">
            Os gatinhos virão descansar nas almofadas. Arraste as ferramentas corretas para deixá-los felizes e colete Fichas Douradas para a Blind Box!
          </p>
        </motion.div>

        {/* Coin Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 border-l border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="relative">
            <Sparkles className="text-twilight-yellow absolute -top-2 -right-2 w-4 h-4 animate-pulse" />
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-twilight-yellow to-[#D4B232] shadow-[0_0_20px_rgba(253,228,129,0.4)] flex items-center justify-center border-2 border-white/50 text-black font-black text-xl">
              C
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-twilight-lavender uppercase tracking-widest">Fichas</span>
            <span className="text-3xl font-black text-white drop-shadow-md">{coins}</span>
          </div>
        </motion.div>
      </div>

      {/* Main Play Area */}
      <div className="flex-1 w-full max-w-5xl relative overflow-hidden my-4 rounded-[3rem] border border-white/5 bg-[#0B0A10]/60 shadow-inner">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-twilight-base/20 via-[#0B0A10]/10 to-transparent pointer-events-none"></div>

        {/* Marcações Tracejadas no chão */}
        {CUSHION_SPOTS.map(spot => (
          <div key={spot.id} className="absolute w-40 h-40" style={{ left: spot.left, top: '50%', marginLeft: '-80px', marginTop: '-80px' }}>
            <div className="absolute bottom-0 left-0 w-40 h-16 rounded-[100%] border-2 border-dashed border-white/10"></div>
          </div>
        ))}

        <AnimatePresence>
          {activeCats.map(cat => (
            <ActiveCat
              key={cat.instanceId}
              cat={cat}
              onTimeout={removeCat}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Tool Tray */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel p-4 rounded-3xl flex gap-6 z-30 mb-2 border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
      >
        {NEEDS.map(tool => (
          <Tool key={tool.id} tool={tool} onDragEnd={handleToolDragEnd} />
        ))}
      </motion.div>

    </div>
  );
};

export default Home;
