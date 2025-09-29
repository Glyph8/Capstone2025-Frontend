import type { SelectedCellState } from "@/store/store"


const SelectedCell = ({ selectedCell, clearCells }: Omit<SelectedCellState, 'updateCell'>) => {

    return (
        <div className="flex flex-row justify-between">
            <div className="relative top-7 left-6 box-content justify-center
                w-56 text-black text-sm font-semibold font-['Roboto'] leading-none tracking-wide">
                {selectedCell.map((sCell) => {
                    console.log(sCell)
                    return (
                        <div>
                            {sCell.day}
                            {sCell.startTime?.hour}:{sCell.startTime?.minute} ~ 
                            {sCell.endTime?.hour}:{sCell.endTime?.minute}
                        </div>
                    )
                })}
            </div>

            <div className="flex justify-center items-center relative top-7 right-7
                w-20 h-7 bg-[#08AC64] rounded-2xl
                 text-white text-xs font-normal font-[Pretendard]"
                onClick={clearCells}>
                선택취소
            </div>
        </div>
    )
}

export default SelectedCell;