import SelectItemButton from "../../components/SelectItemButton";

type InterestGridProps = {
    interests: string[]
    setInterests: (s: string[])=>void
}

const interestList = ["학업", "취업", "웹개발", "프론트", "백엔드", "AI", "DB", "devOps", "마일리지"];

const InterestGrid = ({interests, setInterests}:InterestGridProps) =>{

    const handleClick = (item: string) =>{

        if(interests.some((interest)=> interest === item))
            setInterests(interests.filter((interest)=> interest !== item))
        else
            setInterests([...interests, item])
    }

    return (
        <div className="grid m-9" style={{
                gridTemplateColumns: 'repeat(3, 1fr)',
                // 30분 단위로 28개의 행을 생성
                // gridTemplateRows: `repeat(${TIME_SLOTS.length}, 50px)`,
                // 그리드 라인 사이에 미세한 간격 추가
                gap: '15px',
            }}>
                {interestList.map((item)=>{
                    return <SelectItemButton text={item} handleClick={()=>handleClick(item)}/>
                })}
            
            </div>
    )
}

export default InterestGrid;