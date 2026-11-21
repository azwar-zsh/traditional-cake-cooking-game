import React from 'react';

export const CakeIllustration: React.FC<{ cakeId: string; className?: string }> = ({
  cakeId,
  className = 'w-40 h-32',
}) => {
  switch (cakeId) {
    case 'roti-jala':
      return (
        <svg viewBox="0 0 240 170" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Wooden Tray */}
          <ellipse cx="120" cy="128" rx="102" ry="30" fill="#8D4E2A" />
          <ellipse cx="120" cy="123" rx="96" ry="26" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />
          {/* Banana leaf base */}
          <ellipse cx="115" cy="123" rx="82" ry="20" fill="#15803D" />
          {/* Rolled Lacy Roti Jala pieces */}
          {[0, 1, 2].map((i) => {
            const xOff = 44 + i * 32;
            const yOff = 104 + (i % 2) * 5;
            return (
              <g key={i} transform={`translate(${xOff}, ${yOff}) rotate(-12)`}>
                <rect x="0" y="0" width="48" height="20" rx="9" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
                {/* Lace mesh pattern */}
                <path d="M6 4 L42 16 M6 16 L42 4 M16 2 L28 18 M28 2 L16 18 M34 2 L44 16" stroke="#B45309" strokeWidth="1.3" strokeOpacity="0.65" />
                <circle cx="14" cy="10" r="2.2" fill="#FEF3C7" />
                <circle cx="26" cy="10" r="2.2" fill="#FEF3C7" />
                <circle cx="37" cy="10" r="2.2" fill="#FEF3C7" />
              </g>
            );
          })}
          {/* Curry Bowl */}
          <g transform="translate(138, 66)">
            <ellipse cx="34" cy="48" rx="34" ry="12" fill="#78350F" />
            <path d="M2 28 C2 48, 66 48, 66 28 Z" fill="#92400E" />
            <ellipse cx="34" cy="28" rx="32" ry="12" fill="#FDBA74" stroke="#78350F" strokeWidth="2.5" />
            <ellipse cx="34" cy="28" rx="28" ry="9.5" fill="#EA580C" />
            {/* Chicken pieces & herbs in curry */}
            <ellipse cx="25" cy="27" rx="8" ry="4.5" fill="#FDE047" />
            <ellipse cx="42" cy="30" rx="7" ry="4" fill="#FACC15" />
            <circle cx="33" cy="24" r="3" fill="#15803D" />
            {/* Steam */}
            <path d="M24 12 Q20 4 26 -2" stroke="#FFF" strokeWidth="2" strokeLinecap="round" className="animate-steam-1" />
            <path d="M40 14 Q44 6 38 -1" stroke="#FFF" strokeWidth="2" strokeLinecap="round" className="animate-steam-2" />
          </g>
        </svg>
      );

    case 'timpan-aceh':
      return (
        <svg viewBox="0 0 240 170" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Plate */}
          <ellipse cx="120" cy="128" rx="100" ry="28" fill="#D97706" fillOpacity="0.25" />
          <ellipse cx="120" cy="123" rx="94" ry="24" fill="#FFFBEB" stroke="#B45309" strokeWidth="2.5" />
          {/* Wrapped Banana Leaf Timpan */}
          <g transform="translate(38, 76) rotate(-6)">
            <rect x="0" y="10" width="90" height="34" rx="10" fill="#15803D" stroke="#14532D" strokeWidth="2.5" />
            <path d="M12 10 L22 44 M32 10 L42 44 M52 10 L62 44 M72 10 L80 44" stroke="#166534" strokeWidth="2" />
            <rect x="36" y="10" width="18" height="34" fill="#22C55E" fillOpacity="0.35" />
          </g>
          {/* Unwrapped Timpan showing Golden Pumpkin Skin & Pandan Srikaya Filling */}
          <g transform="translate(86, 94) rotate(5)">
            {/* Opened banana leaf underneath */}
            <ellipse cx="58" cy="24" rx="64" ry="18" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            {/* Pumpkin glutinous skin */}
            <rect x="14" y="4" width="84" height="30" rx="15" fill="#F59E0B" stroke="#B45309" strokeWidth="2.2" />
            {/* Shine highlight */}
            <path d="M26 11 H76" stroke="#FEF08A" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.8" />
            {/* Cut cross-section showing srikaya filling */}
            <ellipse cx="94" cy="19" rx="12" ry="15" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
            <ellipse cx="94" cy="19" rx="7" ry="9" fill="#15803D" />
          </g>
        </svg>
      );

    case 'kue-rangi':
      return (
        <svg viewBox="0 0 240 170" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Woven plate */}
          <ellipse cx="120" cy="126" rx="98" ry="27" fill="#78350F" />
          <ellipse cx="120" cy="122" rx="90" ry="23" fill="#FEF3C7" stroke="#92400E" strokeWidth="2.5" />
          <ellipse cx="120" cy="122" rx="75" ry="17" fill="#16A34A" />
          {/* Half-moon notched Kue Rangi pieces */}
          {[0, 1, 2].map((i) => {
            const x = 48 + i * 38;
            const y = 78 + (i % 2) * 8;
            return (
              <g key={i} transform={`translate(${x}, ${y})`}>
                {/* Coconut sago body */}
                <path d="M4 14 H62 C62 36, 4 36, 4 14 Z" fill="#FFFBEB" stroke="#D97706" strokeWidth="2.2" />
                {/* Toasted bottom crust */}
                <path d="M10 24 C20 34, 46 34, 56 24" stroke="#B45309" strokeWidth="3.5" strokeLinecap="round" />
                {/* Thick glossy palm sugar glaze on top */}
                <path d="M4 14 Q18 6, 33 13 T62 14 C56 22, 42 19, 32 22 C20 24, 10 20, 4 14 Z" fill="#78350F" />
                <path d="M14 14 Q28 11, 46 14" stroke="#FDE68A" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />
              </g>
            );
          })}
        </svg>
      );

    case 'bandros-keju':
      return (
        <svg viewBox="0 0 240 170" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="120" cy="126" rx="98" ry="27" fill="#92400E" fillOpacity="0.25" />
          <ellipse cx="120" cy="122" rx="92" ry="23" fill="#FFFFFF" stroke="#D97706" strokeWidth="2.5" />
          {/* 3 Boat-shaped Bandros with Golden Crust & Grated Cheese */}
          {[0, 1, 2].map((i) => {
            const x = 42 + i * 42;
            const y = 76 + (i === 1 ? -4 : 6);
            return (
              <g key={i} transform={`translate(${x}, ${y})`}>
                {/* Golden buttered bottom shell */}
                <path d="M2 16 C4 42, 64 42, 66 16 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2.2" />
                {/* Soft white coconut rice interior */}
                <ellipse cx="34" cy="16" rx="31" ry="8" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
                {/* Generous Shredded Cheese Mound */}
                <path d="M12 14 Q20 4, 28 15 Q35 2, 42 14 Q50 5, 56 15" stroke="#FACC15" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M16 11 Q26 1, 36 12 Q45 2, 52 12" stroke="#FEF08A" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            );
          })}
        </svg>
      );

    case 'baytat-bengkulu':
      return (
        <svg viewBox="0 0 240 170" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Royal Gold Tray */}
          <ellipse cx="120" cy="126" rx="100" ry="28" fill="#B45309" />
          <ellipse cx="120" cy="122" rx="92" ry="24" fill="#FEF3C7" stroke="#92400E" strokeWidth="2.5" />
          {/* 20x20 Square Tart Isometric View */}
          <g transform="translate(52, 54)">
            {/* Base thickness */}
            <path d="M12 52 L68 78 L124 52 L124 66 L68 92 L12 66 Z" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            {/* Top Diamond Tart Surface */}
            <path d="M12 52 L68 26 L124 52 L68 78 Z" fill="#F59E0B" stroke="#78350F" strokeWidth="2.2" />
            {/* Pineapple Jam Layer Inside */}
            <path d="M24 52 L68 32 L112 52 L68 72 Z" fill="#B45309" />
            {/* Lattice Dough Ribbons (Anyaman Pita) */}
            <path d="M40 42 L92 64 M54 36 L104 58 M28 48 L80 70" stroke="#FDE047" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M96 42 L44 64 M82 36 L32 58 M108 48 L56 70" stroke="#FACC15" strokeWidth="4.5" strokeLinecap="round" />
          </g>
        </svg>
      );

    case 'kue-jongkong':
    default:
      return (
        <svg viewBox="0 0 240 170" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Coaster */}
          <ellipse cx="120" cy="134" rx="88" ry="22" fill="#A7F3D0" stroke="#059669" strokeWidth="2" />
          {/* Two Clear Cups showing 3 Distinct Layers */}
          {[0, 1].map((idx) => {
            const x = idx === 0 ? 54 : 118;
            const y = idx === 0 ? 44 : 52;
            const scale = idx === 0 ? 1 : 0.92;
            return (
              <g key={idx} transform={`translate(${x}, ${y}) scale(${scale})`}>
                {/* Bottom Layer: Palm Sugar Syrup */}
                <path d="M14 66 L58 66 L54 84 C53 88, 19 88, 18 84 Z" fill="#78350F" />
                {/* Middle Layer: Silky Green Pandan */}
                <path d="M10 38 L62 38 L58 66 L14 66 Z" fill="#10B981" />
                {/* Top Layer: Savory White Coconut Cream */}
                <path d="M7 16 L65 16 L62 38 L10 38 Z" fill="#FFFBEB" />
                {/* Cup Rim & Glass Outline */}
                <path d="M6 14 L66 14 L54 84 C53 88, 19 88, 18 84 Z" stroke="#047857" strokeWidth="2.5" fill="none" />
                <ellipse cx="36" cy="14" rx="31" ry="6" fill="#FFFFFF" stroke="#047857" strokeWidth="2.2" />
                {/* Pandan Leaf Garnish & Drizzle */}
                <ellipse cx="36" cy="15" rx="14" ry="3.5" fill="#78350F" />
                <path d="M36 13 C42 4, 52 4, 48 14 Z" fill="#15803D" />
              </g>
            );
          })}
        </svg>
      );
  }
};

export const ChefCharacter: React.FC<{
  mood?: 'happy' | 'excited' | 'oops' | 'focus';
  className?: string;
}> = ({ mood = 'happy', className = 'w-28 h-28' }) => {
  return (
    <svg viewBox="0 0 160 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Warm background aura */}
      <circle cx="80" cy="86" r="64" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
      {/* Chef Toque Hat */}
      <path
        d="M46 52 C34 46, 36 24, 54 24 C60 12, 100 12, 106 24 C124 24, 126 46, 114 52 Z"
        fill="#FFFFFF"
        stroke="#78350F"
        strokeWidth="3"
      />
      <rect x="46" y="47" width="68" height="14" rx="4" fill="#FFFBEB" stroke="#78350F" strokeWidth="3" />
      <path d="M56 54 H104" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Hair & Ears */}
      <circle cx="42" cy="84" r="9" fill="#FDBA74" stroke="#78350F" strokeWidth="2.5" />
      <circle cx="118" cy="84" r="9" fill="#FDBA74" stroke="#78350F" strokeWidth="2.5" />
      <path d="M44 60 C38 74, 40 96, 46 104" stroke="#3E2723" strokeWidth="8" strokeLinecap="round" />
      <path d="M116 60 C122 74, 120 96, 114 104" stroke="#3E2723" strokeWidth="8" strokeLinecap="round" />

      {/* Face */}
      <rect x="46" y="57" width="68" height="58" rx="28" fill="#FED7AA" stroke="#78350F" strokeWidth="3" />

      {/* Rosy Cheeks */}
      <ellipse cx="58" cy="90" rx="6" ry="3.5" fill="#FB7185" fillOpacity="0.55" />
      <ellipse cx="102" cy="90" rx="6" ry="3.5" fill="#FB7185" fillOpacity="0.55" />

      {/* Eyes by mood */}
      {mood === 'excited' && (
        <>
          <path d="M58 78 L65 73 L72 78" stroke="#3E2723" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M88 78 L95 73 L102 78" stroke="#3E2723" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {mood === 'oops' && (
        <>
          <path d="M58 73 L70 81 M70 73 L58 81" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
          <path d="M90 73 L102 81 M102 73 L90 81" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {(mood === 'happy' || mood === 'focus') && (
        <>
          <circle cx="65" cy="78" r="4.5" fill="#3E2723" />
          <circle cx="95" cy="78" r="4.5" fill="#3E2723" />
          <circle cx="63.5" cy="76.5" r="1.5" fill="#FFFFFF" />
          <circle cx="93.5" cy="76.5" r="1.5" fill="#FFFFFF" />
        </>
      )}

      {/* Mouth by mood */}
      {mood === 'oops' ? (
        <circle cx="80" cy="96" r="5.5" fill="#991B1B" stroke="#3E2723" strokeWidth="2.5" />
      ) : mood === 'excited' ? (
        <path d="M68 92 C72 104, 88 104, 92 92 Z" fill="#E11D48" stroke="#3E2723" strokeWidth="2.5" />
      ) : (
        <path d="M70 93 Q80 102 90 93" stroke="#3E2723" strokeWidth="3" strokeLinecap="round" />
      )}

      {/* Chef Apron & Neckerchief */}
      <path d="M52 116 L108 116 L116 146 L44 146 Z" fill="#EA580C" stroke="#78350F" strokeWidth="3" />
      <path d="M68 115 L80 129 L92 115" fill="#FEF08A" stroke="#78350F" strokeWidth="2.5" />
    </svg>
  );
};

export const IngredientIcon: React.FC<{
  type: 'flour' | 'coconut' | 'sugar' | 'egg' | 'spice' | 'liquid' | 'leaf' | 'butter' | 'fruit' | 'meat';
  className?: string;
}> = ({ type, className = 'w-8 h-8' }) => {
  switch (type) {
    case 'flour':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none">
          <rect x="8" y="10" width="24" height="24" rx="5" fill="#FFFBEB" stroke="#B45309" strokeWidth="2.2" />
          <path d="M12 10 C15 6, 25 6, 28 10" stroke="#B45309" strokeWidth="2.2" />
          <circle cx="20" cy="22" r="5" fill="#FDE68A" />
        </svg>
      );
    case 'coconut':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none">
          <path d="M6 20 C6 30, 34 30, 34 20 Z" fill="#78350F" stroke="#451A03" strokeWidth="2" />
          <ellipse cx="20" cy="20" rx="14" ry="6" fill="#FFFFFF" stroke="#78350F" strokeWidth="2" />
          <ellipse cx="20" cy="20" rx="8" ry="3" fill="#E0F2FE" />
        </svg>
      );
    case 'sugar':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none">
          <rect x="8" y="16" width="12" height="12" rx="2" fill="#92400E" stroke="#451A03" strokeWidth="2" />
          <rect x="18" y="12" width="13" height="13" rx="2" fill="#B45309" stroke="#451A03" strokeWidth="2" />
          <circle cx="15" cy="29" r="2" fill="#F59E0B" />
          <circle cx="26" cy="29" r="2" fill="#F59E0B" />
        </svg>
      );
    case 'egg':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none">
          <ellipse cx="20" cy="22" rx="12" ry="10" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
          <circle cx="20" cy="22" r="5.5" fill="#F59E0B" />
          <circle cx="18.5" cy="20.5" r="1.5" fill="#FEF08A" />
        </svg>
      );
    case 'leaf':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none">
          <path d="M8 32 C8 16, 20 8, 32 8 C32 20, 24 32, 8 32 Z" fill="#16A34A" stroke="#14532D" strokeWidth="2" />
          <path d="M10 30 L28 12" stroke="#BBF7D0" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'liquid':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none">
          <path d="M11 10 H29 L27 32 H13 Z" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="2.2" />
          <path d="M13 18 Q20 21 27 18" stroke="#FACC15" strokeWidth="2" />
        </svg>
      );
    case 'butter':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none">
          <rect x="7" y="15" width="26" height="14" rx="3" fill="#FACC15" stroke="#B45309" strokeWidth="2.2" />
          <circle cx="14" cy="21" r="2" fill="#CA8A04" />
          <circle cx="24" cy="23" r="2.5" fill="#CA8A04" />
        </svg>
      );
    case 'fruit':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none">
          <circle cx="20" cy="23" r="11" fill="#F59E0B" stroke="#B45309" strokeWidth="2.2" />
          <path d="M16 12 L20 6 L24 12" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    case 'meat':
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none">
          <path d="M10 24 C10 14, 24 12, 28 18 L33 24 L27 30 C20 32, 10 30, 10 24 Z" fill="#FDBA74" stroke="#9A3412" strokeWidth="2.2" />
        </svg>
      );
    case 'spice':
    default:
      return (
        <svg viewBox="0 0 40 40" className={className} fill="none">
          <circle cx="20" cy="20" r="11" fill="#FDE68A" stroke="#92400E" strokeWidth="2.2" />
          <path d="M20 11 V29 M11 20 H29 M14 14 L26 26 M26 14 L14 26" stroke="#B45309" strokeWidth="2" />
        </svg>
      );
  }
};
