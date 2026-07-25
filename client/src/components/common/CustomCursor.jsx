import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  // Mouse position tracking
  const mousePos = useRef({ x: -100, y: -100 });
  const dotPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  // Cursor interactive state flags
  const cursorState = useRef({
    isHovered: false,
    isButton: false,
    isInput: false,
    isCard: false,
    isMouseDown: false,
  });

  useEffect(() => {
    // Check if device supports fine pointer (mouse)
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsFinePointer(mediaQuery.matches);

    const handleMediaChange = (e) => {
      setIsFinePointer(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    // Add cursor-none class to body when fine pointer is active
    document.body.classList.add('custom-cursor-active');

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Inspect target element for interactive hover states
      const target = e.target;
      if (!target) return;

      const isInputEl =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable;

      const isButtonEl =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button';

      const isCardEl =
        target.closest('.card-premium') ||
        target.closest('.group') ||
        target.tagName === 'IMG';

      cursorState.current.isInput = Boolean(isInputEl);
      cursorState.current.isButton = Boolean(isButtonEl);
      cursorState.current.isCard = Boolean(isCardEl && !isButtonEl && !isInputEl);
      cursorState.current.isHovered = Boolean(isInputEl || isButtonEl || isCardEl);
    };

    const handleMouseDown = () => {
      cursorState.current.isMouseDown = true;
    };

    const handleMouseUp = () => {
      cursorState.current.isMouseDown = false;
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -100, y: -100 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    // 60 FPS Animation Frame Loop with Linear Interpolation (Lerp)
    let animationFrameId;

    const animate = () => {
      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;

      // Dot follows mouse directly (lerp 0.6)
      dotPos.current.x += (targetX - dotPos.current.x) * 0.25;
      dotPos.current.y += (targetY - dotPos.current.y) * 0.25;

      // Outer ring follows with smooth easing (lerp 0.15)
      ringPos.current.x += (targetX - ringPos.current.x) * 0.15;
      ringPos.current.y += (targetY - ringPos.current.y) * 0.15;

      // Render dot position
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0px) translate(-50%, -50%)`;
      }

      // Render ring position and dynamic styling
      if (ringRef.current) {
        const { isButton, isInput, isCard, isMouseDown } = cursorState.current;

        let scale = 1;
        let ringStyle = 'border-emerald-500/40 bg-emerald-500/5';

        if (isMouseDown) {
          scale = 0.75;
        } else if (isButton) {
          scale = 1.2;
          ringStyle = 'border-emerald-400 bg-emerald-500/15 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
        } else if (isCard) {
          scale = 1.2;
          ringStyle = 'border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]';
        } else if (isInput) {
          scale = 0.6;
          ringStyle = 'border-emerald-400/60 bg-transparent';
        }

        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0px) translate(-50%, -50%) scale(${scale})`;
        ringRef.current.className = `fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[99999] transition-all duration-200 ease-out ${ringStyle}`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isFinePointer]);

  if (!isFinePointer) return null;

  return (
    <>
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-emerald-500 pointer-events-none z-[99999] shadow-[0_0_8px_rgba(34,197,94,0.6)]"
      />
      {/* Outer Ring */}
      {/* <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-emerald-500/40 bg-emerald-500/5 pointer-events-none z-[99999]"
      /> */}
    </>
  );
};

export default CustomCursor;
