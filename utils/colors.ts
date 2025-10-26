export const gradients = [
  { color: '#84fab0', color2: '#8fd3f4' }, // Calm
  { color: '#fccb90', color2: '#d57eeb' }, // Vibrant
  { color: '#e0c3fc', color2: '#8ec5fc' }, // Lavender
  { color: '#f093fb', color2: '#f5576c' }, // Pink
  { color: '#4facfe', color2: '#00f2fe' }, // Blue
  { color: '#43e97b', color2: '#38f9d7' }, // Green
  { color: '#fa709a', color2: '#fee140' }, // Sunny
  { color: '#a18cd1', color2: '#fbc2eb' }, // Purple
  { color: '#ff9a9e', color2: '#fecfef' }, // Soft Pink
  { color: '#d4fc79', color2: '#96e6a1' }, // Lime
  { color: '#C5A7FF', color2: '#9274E8' }, // Original Accent
  { color: '#ff7e5f', color2: '#feb47b' }, // Orange
];

export const getRandomGradient = () => {
  const grad = gradients[Math.floor(Math.random() * gradients.length)];
  // For PieWidget, the colors are named color1 and color2
  return { ...grad, color1: grad.color, color2: grad.color2 };
};

export const folderColors = [
  'rgba(167, 197, 255, 0.15)', // Pastel Blue
  'rgba(197, 167, 255, 0.15)', // Pastel Violet
  'rgba(167, 255, 201, 0.15)', // Pastel Mint
  'rgba(255, 167, 224, 0.15)', // Pastel Pink
  'rgba(255, 224, 167, 0.15)', // Pastel Peach
  'rgba(167, 244, 255, 0.15)', // Pastel Cyan
  'rgba(255, 185, 167, 0.15)', // Pastel Coral
  'rgba(220, 167, 255, 0.15)', // Pastel Lavender
];

export const getRandomFolderColor = () => {
    return folderColors[Math.floor(Math.random() * folderColors.length)];
}

export const hexToRgba = (hex: string, opacity: number = 0.15): string => {
    let c: any;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${opacity})`;
    }
    // Fallback for invalid hex
    return 'rgba(197, 167, 255, 0.15)';
};