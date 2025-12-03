import { useRef, useState, useEffect } from "react";
import { useChatBotPageStore } from "../store/store";
import ChatBotIcon from "@/assets/icons/ChatBotIcon3.png";

const ChatBotButton = () => {
  const { openChatBotPage } = useChatBotPageStore();
  
  // 초기 위치 (우측 하단 배치 등은 CSS나 초기값으로 조정)
  const [position, setPosition] = useState({ x: window.innerWidth - 100, y: window.innerHeight - 150 });
  const buttonRef = useRef<HTMLDivElement>(null);

  const dragInfo = useRef({
    isDragging: false,
    hasMoved: false,
    startPos: { x: 0, y: 0 },
    initialButtonPos: { x: 0, y: 0 },
  });

  const getClientCoords = (event: MouseEvent | TouchEvent) => {
    if ("touches" in event) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
    return { x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY };
  };

  const handleDragStart = (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    // 중요: 브라우저 기본 드래그/선택 방지 (데스크탑 스티킹 해결의 핵심)
    // 단, TouchEvent에서는 scroll을 막을 수 있으므로 주의 (CSS touch-action으로 처리됨)
    if (event.type === 'mousedown') {
      event.preventDefault(); 
    }

    const { x, y } = getClientCoords(event.nativeEvent);

    dragInfo.current = {
      isDragging: true,
      hasMoved: false,
      startPos: { x, y },
      initialButtonPos: { ...position },
    };

    window.addEventListener("mousemove", handleDragging);
    window.addEventListener("touchmove", handleDragging, { passive: false }); // 모바일 스크롤 간섭 제어
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchend", handleDragEnd);
  };

  const handleDragging = (event: MouseEvent | TouchEvent) => {
    if (!dragInfo.current.isDragging) return;
    
    // 모바일에서 버튼 드래그 시 화면 스크롤 방지
    if(event.cancelable) event.preventDefault();

    const { x: currentX, y: currentY } = getClientCoords(event);
    const deltaX = currentX - dragInfo.current.startPos.x;
    const deltaY = currentY - dragInfo.current.startPos.y;

    // 움직임 감지 (클릭과 드래그 구분)
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      dragInfo.current.hasMoved = true;
    }

    let nextX = dragInfo.current.initialButtonPos.x + deltaX;
    let nextY = dragInfo.current.initialButtonPos.y + deltaY;

    // --- Boundary Check (화면 밖 이탈 방지) ---
    const buttonWidth = buttonRef.current?.offsetWidth || 64; // 기본값 64
    const buttonHeight = buttonRef.current?.offsetHeight || 64;

    // 화면 너비/높이 제한 (여백 10px 정도 둠)
    const maxX = window.innerWidth - buttonWidth;
    const maxY = window.innerHeight - buttonHeight;

    nextX = Math.min(Math.max(0, nextX), maxX);
    nextY = Math.min(Math.max(0, nextY), maxY);

    setPosition({ x: nextX, y: nextY });
  };

  const handleDragEnd = () => {
    dragInfo.current.isDragging = false;
    
    window.removeEventListener("mousemove", handleDragging);
    window.removeEventListener("touchmove", handleDragging);
    window.removeEventListener("mouseup", handleDragEnd);
    window.removeEventListener("touchend", handleDragEnd);
  };

  const handleClick = () => {
    if (dragInfo.current.hasMoved) {
      dragInfo.current.hasMoved = false;
      return;
    }
    openChatBotPage();
  };

  // 화면 리사이즈 시 버튼이 화면 밖으로 나가는 것 방지 (Optional)
  useEffect(() => {
    const handleResize = () => {
       setPosition(prev => ({
         x: Math.min(prev.x, window.innerWidth - 80),
         y: Math.min(prev.y, window.innerHeight - 80)
       }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={buttonRef}
      className="fixed w-16 h-16 inline-flex justify-center items-center gap-2.5 z-50 shadow-lg rounded-full transition-shadow hover:shadow-xl"
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
      onClick={handleClick}
      style={{
        left: 0, // position을 absolute/fixed의 left/top 기준으로 제어
        top: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`, // GPU 가속 사용
        cursor: "grab",
        touchAction: "none",
      }}
    >
      {/* 이미지가 기본 드래그 동작을 유발하지 않도록 draggable=false 추가 */}
      <img className="w-full h-full pointer-events-none select-none" src={ChatBotIcon} draggable="false" alt="chatbot" />
    </div>
  );
};

export default ChatBotButton;