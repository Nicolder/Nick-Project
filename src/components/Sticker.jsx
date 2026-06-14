import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

const Sticker = ({ item, onDropSticker, isTrayItem }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const stickerRef = useRef(null);
  const isPolaroid = item.type === 'polaroid';
  const isPhoto = item.type === 'photo';
  
  const handleFlip = () => {
    if (isPolaroid) setIsFlipped(!isFlipped);
  };

  const handleDragEnd = (event, info) => {
    if (onDropSticker && stickerRef.current) {
        const rect = stickerRef.current.getBoundingClientRect();
        // Passamos a posição exata da figurinha (rect.left/top) e também a posição do mouse (info.point)
        onDropSticker(item.instanceId, rect.left, rect.top, info.point.x, info.point.y);
    }
  };

  const CardContent = () => (
    <motion.div
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      className={`relative transition-all duration-300 ${
        isTrayItem 
          ? (isPolaroid ? 'w-[110px] h-[130px]' : isPhoto ? 'w-[90px] h-[90px]' : 'w-[80px] h-[80px]')
          : (isPolaroid ? 'w-[220px] h-[270px]' : isPhoto ? 'w-[180px] h-[180px]' : 'w-[160px] h-[160px]')
      }`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Face da Frente */}
      <div 
        className={`absolute w-full h-full flex flex-col p-2 shadow-md border border-gray-100 ${isPhoto || isPolaroid ? 'bg-white' : 'bg-transparent'}`} 
        style={{ backfaceVisibility: 'hidden', borderRadius: isPolaroid ? '8px' : isPhoto ? '4px' : '0' }}
      >
        <div className={`w-full flex-1 overflow-hidden flex items-center justify-center ${isPolaroid || isPhoto ? 'rounded-md bg-gray-50' : 'rounded-none bg-transparent'}`}>
           <img 
              src={item.url} 
              alt={item.text} 
              className={`w-full h-full pointer-events-none ${isPolaroid || isPhoto ? 'object-cover object-center' : 'object-contain object-center scale-90 drop-shadow-md'}`}
              draggable="false"
            />
        </div>
        {isPolaroid && (
           <div className={`${isTrayItem ? 'mt-1 mb-0' : 'mt-3 mb-2'} text-center`}>
             <p className={`font-handwriting text-twilight-base leading-tight ${isTrayItem ? 'text-sm' : 'text-3xl'}`}>{item.text}</p>
           </div>
        )}
      </div>

      {/* Face de Trás (Revelação) */}
      {isPolaroid && (
        <div 
          className={`absolute w-full h-full flex flex-col justify-center items-center ${isTrayItem ? 'p-2' : 'p-6'} bg-gradient-to-br from-twilight-cream to-white rounded-lg border border-twilight-lavender/30 shadow-md`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className={`${isTrayItem ? 'text-lg mb-0' : 'text-4xl mb-2'}`}>💌</span>
          <p className={`font-handwriting text-twilight-base text-center leading-snug px-1 ${isTrayItem ? 'text-xs' : 'text-2xl'}`}>
             {item.secretMessage || '"O melhor momento..."'}
          </p>
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      ref={stickerRef}
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onDoubleClick={handleFlip}
      className={`cursor-grab active:cursor-grabbing ${isTrayItem ? 'relative' : 'absolute'}`}
      style={isTrayItem ? {} : {
        top: item.y,
        left: item.x,
        rotate: `${item.rotation}deg`
      }}
      initial={isTrayItem ? { scale: 0, y: 20 } : false}
      animate={isTrayItem ? { scale: 1, opacity: 1, y: 0 } : { scale: 1, opacity: 1, x: 0, y: 0 }}
      whileHover={{ scale: 1.05, zIndex: 100 }}
      whileDrag={{ scale: 1.1, zIndex: 100 }}
    >
      {isPolaroid ? (
        <Tilt
          glareEnable={true}
          glareMaxOpacity={0.4}
          glareColor="#ffffff"
          glarePosition="all"
          tiltMaxAngleX={15}
          tiltMaxAngleY={15}
          scale={1}
          transitionSpeed={400}
          className="rounded-xl shadow-[0_15px_35px_rgba(113,76,143,0.15)] pointer-events-auto"
        >
           <CardContent />
        </Tilt>
      ) : (
        <div className="drop-shadow-lg pointer-events-auto">
           <CardContent />
        </div>
      )}
    </motion.div>
  );
};

export default Sticker;
