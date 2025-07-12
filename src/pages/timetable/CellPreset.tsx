
import type { Preset } from "../../types/types";

type CellPresetProps = {
    preset: Preset;
}

const CellPreset = ({ preset }: CellPresetProps) => {
    const { eventName, eventDetail, color } = preset;
    return (

        <div className="flex flex-row justify-between items-center
                w-full h-14 bg-[#FCFFFF] rounded-2xl shadow-[0px_1px_1px_0px_rgba(24,53,47,1.00)] 
                mt-5 pl-4 pr-4">

            <div className="flex justify-center items-center rounded-full w-9 h-9"
                style={{ backgroundColor: color }}>
                <img src="/icons/color-fill-icon.svg" />
            </div>

            <div className="flex flex-col justify-start items-start">
                <div className="w-full text-Schemes-On-Surface text-base font-medium font-['Pretandard'] leading-normal tracking-tight">
                    {eventName}
                </div>
                <div className="w-full">
                    <span className="text-Schemes-On-Surface text-xs font-normal font-['Pretandard'] leading-tight">
                        {eventDetail}
                    </span>
                </div>
            </div>

            <div className="w-15 flex flex-row items-center justify-between">
                <div className="w-6 h-6">
                    <img src="/icons/check-icon.svg" />
                </div>

                <div className="w-6 h-6">
                    <img src="/icons/trashcan-icon.svg" />
                </div>
            </div>
        </div>

    )
}

export default CellPreset;