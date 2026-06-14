import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

const STORAGE_KEYS = {
  COINS: 'cozy_twilight_coins',
  INVENTORY: 'cozy_twilight_inventory',
  PAGES: 'cozy_twilight_pages'
};

export const GameProvider = ({ children }) => {
  const [coins, setCoins] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COINS);
    return saved ? JSON.parse(saved) : 0;
  }); 
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return saved ? JSON.parse(saved) : [];
  }); 
  const [pageTexts, setPageTexts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAGES);
    return saved ? JSON.parse(saved) : {
      'pagina_1': '',
      'pagina_2': '',
      'pagina_3': ''
    };
  });

  // Salvar no LocalStorage sempre que houver mudança
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COINS, JSON.stringify(coins));
  }, [coins]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(pageTexts));
  }, [pageTexts]);
  const addCoin = () => setCoins(prev => prev + 1);
  
  const spendCoin = () => {
    if (coins > 0) {
      setCoins(prev => prev - 1);
      return true;
    }
    return false;
  };

  const unlockItem = (item) => {
    setInventory(prev => [...prev, {
      ...item,
      instanceId: Date.now() + Math.random(),
      placed: false,
      pageId: null, // Will be set when placed
      x: 0,
      y: 0,
      rotation: Math.random() * 16 - 8
    }]);
  };

  const updateStickerPosition = (instanceId, x, y, placed = true, pageId = null) => {
    setInventory(prev => prev.map(item => 
      item.instanceId === instanceId 
        ? { ...item, placed, x, y, pageId } 
        : item
    ));
  };

  const updatePageText = (pageId, text) => {
    setPageTexts(prev => ({ ...prev, [pageId]: text }));
  };

  return (
    <GameContext.Provider value={{
      coins,
      addCoin,
      spendCoin,
      inventory,
      unlockItem,
      updateStickerPosition,
      pageTexts,
      updatePageText
    }}>
      {children}
    </GameContext.Provider>
  );
};

