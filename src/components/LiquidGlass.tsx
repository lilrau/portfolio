"use client";

import React, { ReactNode, CSSProperties } from 'react';

interface LiquidGlassProps {
  children: ReactNode;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  cornerRadius?: number;
  padding?: string;
  onClick?: () => void;
  className?: string;
}

const LiquidGlass: React.FC<LiquidGlassProps> = ({
  children,
  displacementScale = 64,
  blurAmount = 0.1,
  saturation = 130,
  aberrationIntensity = 2,
  elasticity = 0.35,
  cornerRadius = 100,
  padding = "8px 16px",
  onClick,
  className = ""
}) => {
  const buttonStyle: CSSProperties = {
    padding,
    borderRadius: `${cornerRadius}px`,
    background: `
      linear-gradient(135deg, 
        rgba(255, 255, 255, 0.1) 0%, 
        rgba(255, 255, 255, 0.05) 100%)
    `,
    backdropFilter: `blur(${blurAmount * 10}px) saturate(${saturation}%)`,
    WebkitBackdropFilter: `blur(${blurAmount * 10}px) saturate(${saturation}%)`,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    transition: `all ${elasticity}s cubic-bezier(0.4, 0, 0.2, 1)`,
    transform: 'translateZ(0)',
  };

  const glassOverlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 50% 50%, 
        rgba(255, 255, 255, ${aberrationIntensity * 0.01}) 0%, 
        transparent 70%)
    `,
    opacity: 0,
    transition: `opacity ${elasticity}s ease`,
    pointerEvents: 'none',
  };

  const rippleStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${displacementScale}px`,
    height: `${displacementScale}px`,
    background: 'radial-gradient(circle, rgba(0, 0, 0, 0.12) 0%, transparent 70%)',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%) scale(0)',
    transition: `transform ${elasticity}s ease`,
    pointerEvents: 'none',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const overlay = button.querySelector('.glass-overlay') as HTMLElement;
    
    if (overlay) {
      overlay.style.opacity = '1';
    }
    
    button.style.transform = `translateY(-2px) scale(${1 + elasticity * 0.1})`;
    button.style.boxShadow = `
      0 12px 40px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(82, 82, 82, 0.3)
    `;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const overlay = button.querySelector('.glass-overlay') as HTMLElement;
    const ripple = button.querySelector('.ripple') as HTMLElement;
    
    if (overlay) {
      overlay.style.opacity = '0';
    }
    
    if (ripple) {
      ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    }
    
    button.style.transform = 'translateY(0) scale(1)';
    button.style.boxShadow = `
      0 8px 32px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const ripple = button.querySelector('.ripple') as HTMLElement;
    
    if (ripple) {
      ripple.style.transform = 'translate(-50%, -50%) scale(1)';
    }
    
    button.style.transform = `translateY(1px) scale(${1 - elasticity * 0.05})`;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const ripple = button.querySelector('.ripple') as HTMLElement;
    
    if (ripple) {
      setTimeout(() => {
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
      }, 150);
    }
    
    button.style.transform = `translateY(-2px) scale(${1 + elasticity * 0.1})`;
  };

  return (
    <button
      style={buttonStyle}
      className={`liquid-glass-button ${className}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div className="glass-overlay" style={glassOverlayStyle} />
      <div className="ripple" style={rippleStyle} />
      <span style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </span>
    </button>
  );
};

export default LiquidGlass;