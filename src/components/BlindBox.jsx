import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Gift, Lock, PackageOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import { getRandomLoot } from '../data/lootPool';

const BlindBox = () => {
  const { coins, spendCoin, unlockItem, inventory } = useGame();
  
  // 0: Aguardando Moeda, 1: Moeda Inserida (Pronta), 2: Clicou 1x, 3: Clicou 2x, 4: Aberta
  const [boxState, setBoxState] = useState(0); 
  const [currentLoot, setCurrentLoot] = useState(null);

  const handleCoinDragEnd = (event, info) => {
    // Dropzone no centro
    if (info.offset.y < -30 || info.offset.y > 30 || info.offset.x > 30 || info.offset.x < -30) {
      if (spendCoin()) {
        setBoxState(1);
      }
    }
  };

  const fireConfetti = (rarity) => {
    const colors = rarity === 'legendary' ? ['#FDE481', '#EAA9B8', '#FFFFFF'] : 
                   rarity === 'rare' ? ['#B5A8D5', '#2D284B', '#FFFFFF'] : 
                   ['#EAA9B8', '#FEFCF5', '#FFFFFF'];
    
    // Explosão em múltiplos ângulos
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000, colors };
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = 1000;
      if (timeLeft <= 0) return clearInterval(interval);

      confetti(Object.assign({}, defaults, { particleCount: 50, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount: 50, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
    
    setTimeout(() => clearInterval(interval), 1000);
  };

  const handleBoxClick = () => {
    if (boxState === 0 || boxState === 4) return;
    
    if (boxState === 1) {
      setBoxState(2); // Primeiro clique: Treme
    } else if (boxState === 2) {
      setBoxState(3); // Segundo clique: Brilha mais forte
    } else if (boxState === 3) {
      // Terceiro clique: Abre!
      const loot = getRandomLoot(inventory);
      setCurrentLoot(loot);
      setBoxState(4);
      fireConfetti(loot.rarity);
    }
  };

  const resetBox = () => {
    if (currentLoot) {
      unlockItem(currentLoot);
      setCurrentLoot(null);
      setBoxState(0);
    }
  };

  // Variações de animação baseadas no estado da caixa
  const boxVariants = {
    idle: { scale: 1, y: 0 },
    ready: { scale: 1.05, y: -5, boxShadow: "0 0 40px rgba(234,169,184,0.4)" },
    shake1: { 
        x: [-5, 5, -5, 5, 0], 
        y: [-2, 2, -2, 2, 0],
        scale: 1.1,
        boxShadow: "0 0 60px rgba(253,228,129,0.6)",
        transition: { duration: 0.4 }
    },
    shake2: { 
        x: [-10, 10, -10, 10, -5, 5, 0], 
        scale: 1.15,
        filter: "brightness(1.5)",
        boxShadow: "0 0 100px rgba(253,228,129,0.9)",
        transition: { duration: 0.5 }
    },
    open: {
        scale: 1.5,
        opacity: 0,
        filter: "blur(20px)",
        transition: { duration: 0.5 }
    }
  };

  return (
    <div className="relative w-full max-w-sm mt-6 md:mt-12 flex flex-col items-center justify-center min-h-[400px]">
      
      {/* Aviso */}
      <AnimatePresence>
        {coins === 0 && boxState === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-0 w-[110%] text-center glass-panel px-6 py-4 rounded-2xl border-twilight-yellow/30 text-sm font-sans font-bold text-twilight-yellow z-10 shadow-neon-yellow"
          >
            Você precisa de Fichas Douradas para adquirir uma Blind Box.
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ficha Dourada Arrastável */}
      <AnimatePresence>
        {boxState === 0 && coins > 0 && (
          <motion.div 
            className="absolute bottom-10 z-50 w-24 h-24 rounded-full bg-gradient-to-br from-[#FFF5C3] via-twilight-yellow to-[#D4B232] flex items-center justify-center border-4 border-white/60 shadow-[0_0_40px_rgba(253,228,129,0.8)] cursor-grab active:cursor-grabbing touch-none"
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDragEnd={handleCoinDragEnd}
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: -100 }}
            whileHover={{ scale: 1.1 }}
            whileDrag={{ scale: 1.2, zIndex: 100 }}
          >
            <Sparkles className="text-black drop-shadow-sm" size={36} />
            <span className="absolute -top-8 text-[10px] font-bold text-white uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full whitespace-nowrap">
                Arraste para a caixa
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* A Caixa Misteriosa (Blind Box) */}
      <div className="relative z-20 flex justify-center items-center mt-12 w-full h-64">
        
        {/* Fundo brilhante quando pronta */}
        <div className={`absolute inset-0 bg-twilight-yellow/20 blur-[80px] rounded-full transition-opacity duration-1000 ${boxState > 0 && boxState < 4 ? 'opacity-100' : 'opacity-0'} pointer-events-none -z-10`}></div>

        <AnimatePresence>
            {boxState < 4 && (
                <motion.div
                    className={`relative w-48 h-56 rounded-3xl border-2 flex flex-col items-center justify-center cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden transition-colors duration-500
                        ${boxState === 0 ? 'bg-gradient-to-br from-[#1C1930] to-[#0B0A10] border-white/10' : 'bg-gradient-to-br from-twilight-base to-twilight-dark border-twilight-pink/50'}`}
                    variants={boxVariants}
                    initial="idle"
                    animate={
                        boxState === 0 ? "idle" :
                        boxState === 1 ? "ready" :
                        boxState === 2 ? "shake1" : "shake2"
                    }
                    exit="open"
                    onClick={handleBoxClick}
                    whileHover={boxState > 0 ? { scale: 1.08 } : {}}
                    whileTap={boxState > 0 ? { scale: 0.95 } : {}}
                >
                    {/* Fita decorativa Vertical */}
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-b from-twilight-pink to-[#C2798A] shadow-lg"></div>
                    {/* Fita decorativa Horizontal */}
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-r from-twilight-pink to-[#C2798A] shadow-lg"></div>
                    
                    {/* Laço (Bow) */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#0B0A10]/80 rounded-full border-4 border-twilight-pink flex items-center justify-center z-10 shadow-2xl backdrop-blur-md">
                        {boxState === 0 ? (
                            <Lock className="text-white/30" size={24} />
                        ) : (
                            <Gift className={`text-twilight-yellow ${boxState > 1 ? 'animate-pulse scale-125' : ''} transition-all`} size={32} />
                        )}
                    </div>

                    {/* Brilho interno dinâmico */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/10 pointer-events-none"></div>

                    {/* Dica de clique */}
                    {boxState > 0 && (
                        <span className="absolute bottom-4 text-[10px] font-black text-white/80 uppercase tracking-widest bg-black/50 px-3 py-1 rounded-full z-20">
                            {boxState === 1 ? "Clique para abrir" : boxState === 2 ? "Mais forte!" : "QUASE LÁ!"}
                        </span>
                    )}
                </motion.div>
            )}
        </AnimatePresence>

        {/* Revelação do Prêmio */}
        <AnimatePresence>
          {boxState === 4 && currentLoot && (
            <motion.div 
              className="absolute flex flex-col items-center justify-center cursor-pointer z-50 w-full"
              initial={{ scale: 0, y: 100, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              onClick={resetBox}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
               {/* Efeito de Brilho de Fundo baseado na raridade */}
               <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[60px] -z-10 ${currentLoot.rarity === 'legendary' ? 'bg-[#FDE481]/60' : currentLoot.rarity === 'rare' ? 'bg-[#B5A8D5]/60' : 'bg-[#EAA9B8]/60'}`}></div>
               
               {/* A Figurinha em Si */}
               <div className={`relative flex flex-col shadow-2xl border ${currentLoot.type === 'sticker' ? 'bg-transparent border-transparent p-0' : 'bg-white p-3 border-gray-100'}`} style={{ borderRadius: currentLoot.type === 'polaroid' ? '12px' : currentLoot.type === 'photo' ? '6px' : '0' }}>
                   
                   <div className={`w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] overflow-hidden flex items-center justify-center ${currentLoot.type === 'sticker' ? 'bg-transparent' : 'bg-gray-50 rounded-md'}`}>
                       <img 
                          src={currentLoot.url} 
                          alt={currentLoot.text}
                          className={`w-full h-full ${currentLoot.type === 'sticker' ? 'object-contain drop-shadow-xl scale-110' : 'object-cover'} pointer-events-none`}
                       />
                   </div>
                   
                   {currentLoot.type === 'polaroid' && (
                       <div className="mt-4 mb-2 text-center w-[160px] sm:w-[220px]">
                           <p className="font-handwriting text-twilight-base text-2xl sm:text-3xl leading-tight">{currentLoot.text}</p>
                       </div>
                   )}
               </div>

               {/* Botão de Coletar Flutuante */}
               <motion.div 
                  animate={{ y: [-3, 3] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                  className={`mt-6 px-6 py-3 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest text-white shadow-xl flex items-center gap-2 ${currentLoot.rarity === 'legendary' ? 'bg-gradient-to-r from-[#D4B232] to-[#FDE481] text-black shadow-[0_10px_30px_rgba(253,228,129,0.5)]' : currentLoot.rarity === 'rare' ? 'bg-gradient-to-r from-[#7A6B9E] to-[#B5A8D5] shadow-[0_10px_30px_rgba(181,168,213,0.5)]' : 'bg-gradient-to-r from-[#C2798A] to-[#EAA9B8] shadow-[0_10px_30px_rgba(234,169,184,0.5)]'}`}
               >
                   <PackageOpen size={18} /> Guardar no Diário
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default BlindBox;
