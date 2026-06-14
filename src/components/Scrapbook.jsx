import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import Sticker from './Sticker';
import { BookOpen, Sparkles, Heart } from 'lucide-react';

const PAGES = [
  { id: 'pagina_1', title: 'Página 1', icon: <BookOpen size={18} />, color: 'bg-[#FDFBF7]', bookmark: 'bg-twilight-base', textColor: 'text-twilight-base' },
  { id: 'pagina_2', title: 'Página 2', icon: <Heart size={18} />, color: 'bg-[#FDFBF7]', bookmark: 'bg-twilight-lavender', textColor: 'text-twilight-lavender' },
  { id: 'pagina_3', title: 'Página 3', icon: <Sparkles size={18} />, color: 'bg-[#FDFBF7]', bookmark: 'bg-twilight-pink', textColor: 'text-twilight-pink' }
];

const Scrapbook = () => {
  const { inventory, updateStickerPosition, pageTexts, updatePageText } = useGame();
  const [activePage, setActivePage] = useState('pagina_1');
  const bookRef = useRef(null);

  // Figurinha coladas na página atual
  const placedItems = inventory.filter(item => item.placed && item.pageId === activePage);
  // Todas as figurinhas não coladas vão pra bandeja
  const unplacedItems = inventory.filter(item => !item.placed);

  const handleDropSticker = (instanceId, stickerLeft, stickerTop, clientX, clientY) => {
    if (!bookRef.current) return;
    const rect = bookRef.current.getBoundingClientRect();
    
    // Checa se soltou dentro dos limites do livro
    if (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    ) {
      // Posição final fisicamente exata, baseada na caixa limitadora (bounding box) da figurinha!
      const x = stickerLeft - rect.left; 
      const y = stickerTop - rect.top;
      updateStickerPosition(instanceId, x, y, true, activePage);
    } else {
      // Devolve para a bandeja
      updateStickerPosition(instanceId, 0, 0, false, null);
    }
  };

  return (
    <div className="w-full h-full min-h-[85vh] relative flex flex-col mt-4 max-w-5xl overflow-visible pb-40">
      
      {/* Abas Superiores */}
      <div className="flex justify-center md:justify-start gap-1 md:gap-3 mb-0 z-10 px-4 md:px-8">
        {PAGES.map(page => (
          <button
            key={page.id}
            onClick={() => setActivePage(page.id)}
            className={`flex items-center gap-2 px-5 py-3 md:px-7 md:py-4 rounded-t-2xl font-sans font-bold text-xs md:text-sm transition-all duration-300 ${
              activePage === page.id 
                ? `${page.bookmark} text-twilight-darkest shadow-[0_-10px_20px_rgba(0,0,0,0.2)] translate-y-2 z-20` 
                : 'bg-twilight-darkest/40 text-twilight-lavender/60 border border-twilight-base/30 hover:bg-twilight-darkest/60 hover:-translate-y-1'
            }`}
            style={{ paddingBottom: activePage === page.id ? '2rem' : '' }}
          >
            {page.icon}
            {page.title}
            <span className={`ml-1 md:ml-2 px-2 py-0.5 rounded-full text-[10px] md:text-xs shadow-sm font-extrabold ${activePage === page.id ? 'bg-twilight-cream text-twilight-darkest' : 'bg-twilight-darkest text-twilight-lavender/60'}`}>
              {inventory.filter(item => item.placed && item.pageId === page.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* O Livro Fisico (Área de Drop) */}
      <div className="flex-1 bg-[#2A2338] p-2 md:p-3 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] z-30 border border-twilight-base/50 relative">
        <div 
          ref={bookRef}
          className={`relative w-full h-full min-h-[550px] rounded-2xl ${PAGES.find(p => p.id === activePage).color} overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.04)] border border-[#EAE3D4] transition-colors duration-500`}
        >
          {/* Textura */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(161,149,197,0.1)_95%)] bg-[length:100%_2rem] pointer-events-none"></div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activePage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Área de Texto Livre */}
              <textarea
                value={pageTexts[activePage] || ''}
                onChange={(e) => updatePageText(activePage, e.target.value)}
                placeholder="Escreva algo especial aqui..."
                className="absolute inset-0 w-full h-full bg-transparent resize-none outline-none p-6 md:p-10 font-handwriting text-2xl text-twilight-base/80 z-0"
                style={{
                  lineHeight: '2rem',
                  paddingTop: '2.4rem'
                }}
              />

              {placedItems.map(item => (
                <Sticker 
                  key={`${item.instanceId}-${item.x}-${item.y}`} 
                  item={item} 
                  onDropSticker={handleDropSticker}
                  isTrayItem={false} 
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bandeja de Figurinhas (Inventário não colado) */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 max-w-7xl mx-auto glass-panel border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] z-50 flex flex-col px-6 md:px-12 rounded-t-3xl backdrop-blur-2xl bg-twilight-darkest/80"
      >
        <div className="w-full flex items-center justify-between py-3 border-b border-white/5 mb-3">
            <span className="text-[10px] md:text-xs font-bold text-twilight-yellow tracking-widest uppercase flex items-center gap-2">
                <Sparkles size={14} /> Bandeja de Figurinhas
            </span>
            <span className="text-[9px] md:text-[10px] font-bold bg-white/10 px-3 py-1 rounded-full text-white/60 uppercase tracking-wider">
                Arraste para o livro
            </span>
        </div>
        
        {/* Usamos flex-wrap para permitir que as figurinhas caiam pra linha de baixo caso encha, sem causar overflow:hidden clip! */}
        <div className="w-full flex flex-wrap items-center justify-center gap-4 pb-6 min-h-[120px]">
            {unplacedItems.length === 0 ? (
                <div className="w-full text-center text-white/30 text-xs italic">Nenhuma figurinha aguardando.</div>
            ) : (
                <AnimatePresence>
                    {unplacedItems.map(item => (
                        <div key={item.instanceId} className="relative z-50">
                            <Sticker 
                                item={item} 
                                onDropSticker={handleDropSticker} 
                                isTrayItem={true} 
                            />
                        </div>
                    ))}
                </AnimatePresence>
            )}
        </div>
      </motion.div>
    </div>
  );
};

export default Scrapbook;
