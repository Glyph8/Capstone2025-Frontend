import {useRef, useState } from "react";
import { useChatBotPageStore } from "../store/store"
import ChatBotIcon from "@/assets/icons/ChatBotIcon3.png"
const ChatBotButton = () => {
    const { openChatBotPage } = useChatBotPageStore();
    const [position, setPosition] = useState({ x: 290, y: -80 });

    // useRef를 사용하여 드래그 상태와 위치 정보를 관리합니다.
    // ref는 리렌더링을 유발하지 않아 드래그 같은 빈번한 이벤트 처리에 유리합니다.
    const dragInfo = useRef({
        isDragging: false,
        hasMoved: false, // 드래그 동작으로 움직였는지 여부
        startPos: { x: 0, y: 0 },
        initialButtonPos: { x: 0, y: 0 },
    });

    // 이벤트에서 좌표를 일관되게 추출하는 헬퍼 함수
    const getClientCoords = (event: MouseEvent | TouchEvent) => {
        if ('touches' in event) { // TouchEvent
            return { x: event.touches[0].clientX, y: event.touches[0].clientY };
        }
        // MouseEvent
        return { x: event.clientX, y: event.clientY };
    };

    const handleDragStart = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        const { x, y } = getClientCoords(event.nativeEvent);
        
        dragInfo.current = {
            isDragging: true,
            hasMoved: false,
            startPos: { x, y },
            initialButtonPos: { ...position },
        };

        // 전역 이벤트 리스너 추가
        window.addEventListener('mousemove', handleDragging);
        window.addEventListener('touchmove', handleDragging);
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchend', handleDragEnd);
    };

    const handleDragging = (event: MouseEvent | TouchEvent) => {
        if (!dragInfo.current.isDragging) return;

        // 드래그 움직임이 시작되었음을 표시
        if (!dragInfo.current.hasMoved) {
            dragInfo.current.hasMoved = true;
        }

        const { x: currentX, y: currentY } = getClientCoords(event);
        const deltaX = currentX - dragInfo.current.startPos.x;
        const deltaY = currentY - dragInfo.current.startPos.y;

        setPosition({
            x: dragInfo.current.initialButtonPos.x + deltaX,
            y: dragInfo.current.initialButtonPos.y + deltaY,
        });
    };

    const handleDragEnd = () => {
        // 전역 이벤트 리스너 제거
        window.removeEventListener('mousemove', handleDragging);
        window.removeEventListener('touchmove', handleDragging);
        window.removeEventListener('mouseup', handleDragEnd);
        window.removeEventListener('touchend', handleDragEnd);
        
        dragInfo.current.isDragging = false;
    };

    const handleClick = () => {
        // hasMoved 플래그를 확인하여 드래그였다면 클릭 로직을 실행하지 않음
        if (dragInfo.current.hasMoved) {
            // 드래그가 끝난 후 다음 클릭을 위해 hasMoved 상태를 리셋
            dragInfo.current.hasMoved = false;
            return;
        }
        openChatBotPage();
    };

    return (
        <div className="absolute w-16 h-16
        inline-flex justify-center items-center gap-2.5 z-10"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            onClick={handleClick}

            style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                cursor: dragInfo.current.isDragging ? 'grabbing' : 'grab',
                touchAction: 'none', // 모바일에서 드래그 시 페이지 스크롤 방지
            }}>
            <img className="w-full h-full" src={ChatBotIcon} />
        </div>
    )
}

export default ChatBotButton