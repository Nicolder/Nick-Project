// Importa todas as imagens da pasta stickers e polaroids automaticamente (requer Vite)
const stickerModules = import.meta.glob('../assets/stickers/*.{png,jpg,jpeg,gif,webp}', { eager: true, as: 'url' });
const polaroidModules = import.meta.glob('../assets/polaroids/*.{png,jpg,jpeg,gif,webp}', { eager: true, as: 'url' });
const photoModules = import.meta.glob('../assets/fotos/*.{png,jpg,jpeg,gif,webp}', { eager: true, as: 'url' });

// Converte as imagens da pasta stickers em itens comuns
const dynamicStickers = Object.keys(stickerModules).map((path, index) => {
  const filename = path.split('/').pop().split('.')[0];
  return {
    id: `dyn_stk_${index}`,
    type: 'sticker',
    rarity: 'common',
    url: stickerModules[path],
    text: filename.replace(/_/g, ' '),
    theme: 'custom'
  };
});

// Converte as imagens da pasta polaroids em itens raros/lendários
const dynamicPolaroids = Object.keys(polaroidModules).map((path, index) => {
  const filename = path.split('/').pop().split('.')[0];
  // Se tiver "lendario" no nome, vira lendário
  const isLegendary = filename.toLowerCase().includes('lendario') || filename.toLowerCase().includes('legendary');

  return {
    id: `dyn_pol_${index}`,
    type: 'polaroid',
    rarity: isLegendary ? 'legendary' : 'rare',
    url: polaroidModules[path],
    text: filename.replace(/_/g, ' ').replace(/lendario|legendary/gi, '').trim(),
    theme: 'custom',
    secretMessage: '...' // Pode ser editado no código depois
  };
});

// Converte as imagens da pasta fotos
const dynamicPhotos = Object.keys(photoModules).map((path, index) => {
  const filename = path.split('/').pop().split('.')[0];
  const isLegendary = filename.toLowerCase().includes('lendario') || filename.toLowerCase().includes('legendary');

  return {
    id: `dyn_pho_${index}`,
    type: 'photo',
    rarity: isLegendary ? 'legendary' : 'rare',
    url: photoModules[path],
    text: filename.replace(/_/g, ' ').replace(/lendario|legendary/gi, '').trim(),
    theme: 'custom'
  };
});

// Junta tudo na lootPool!
export const lootPool = [
  ...dynamicStickers,
  ...dynamicPolaroids,
  ...dynamicPhotos,

  // Se as pastas estiverem vazias, mantemos alguns de exemplo para a máquina não quebrar
  ...(Object.keys(stickerModules).length === 0 && Object.keys(polaroidModules).length === 0 && Object.keys(photoModules).length === 0 ? [
    { id: 'c1', type: 'sticker', rarity: 'common', url: '/assets/cats/camomila.png', text: 'Miau', theme: 'gatinhos' },
    { id: 'r1', type: 'polaroid', rarity: 'rare', url: '/assets/cats/neva.png', text: 'Nossa Viagem', theme: 'momentos', secretMessage: 'Um dos dias mais incríveis.' },
    { id: 'l1', type: 'polaroid', rarity: 'legendary', url: '/assets/cats/pitanguinha.png', text: 'Eu te amo', theme: 'momentos', secretMessage: 'Para sempre, meu amor.' }
  ] : [])
];

// Função que sorteia o item quando a máquina gira
export const getRandomLoot = (currentInventory = []) => {
  const roll = Math.random() * 100;
  let rarity = 'common';

  if (roll > 90) rarity = 'legendary';
  else if (roll > 60) rarity = 'rare';

  // Extrai os IDs base que o usuário já tem
  const ownedBaseIds = currentInventory.map(item => item.id);
  
  // Filtra itens da raridade sorteada
  const poolOfRarity = lootPool.filter(item => item.rarity === rarity);
  
  // Desses itens, quais o usuário ainda não tem?
  const unownedOfRarity = poolOfRarity.filter(item => !ownedBaseIds.includes(item.id));
  
  let finalPool = [];

  if (unownedOfRarity.length > 0) {
    // 1. Caso Ideal: Sorteou uma raridade que ainda tem figurinhas inéditas!
    finalPool = unownedOfRarity;
  } else {
    // 2. Fallback: Já platinou essa raridade. Procura qualquer item inédito no jogo todo!
    const allUnowned = lootPool.filter(item => !ownedBaseIds.includes(item.id));
    if (allUnowned.length > 0) {
      finalPool = allUnowned;
    } else {
      // 3. O usuário já platinou O JOGO INTEIRO. Permite repetidas da raridade sorteada.
      if (poolOfRarity.length > 0) {
        finalPool = poolOfRarity;
      } else {
        // 4. Último caso de erro: dá qualquer coisa do jogo.
        finalPool = lootPool;
      }
    }
  }

  const randomIndex = Math.floor(Math.random() * finalPool.length);
  const selectedItem = finalPool[randomIndex] || lootPool[0];

  return { ...selectedItem };
};
