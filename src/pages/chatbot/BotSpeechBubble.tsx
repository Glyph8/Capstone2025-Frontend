import type { Program } from "@/generated-api/Api";

type BotSpeechBubbleProps = {
    text: string;
    recommendedProgramList?: Program[];
};

const BotSpeechBubble = ({ text, recommendedProgramList }: BotSpeechBubbleProps) => {
    return (
        <div className="flex flex-col w-[90%] justify-start bg-[#FCFFFF] rounded-l-xl rounded-tr-[50px] rounded-br-[50px] p-4 space-y-3 shadow-md">
            <div className="text-sm whitespace-pre-line">{text}</div>

            {recommendedProgramList?.map((program, idx) => (
                <div key={idx} className="bg-[#F0F4F8] p-3 rounded-lg space-y-1 text-sm">
                    <div className="font-semibold">{program.title}</div>
                    <a href={program.url} className="text-blue-600 underline" target="_blank">
                        프로그램 위인전 링크
                    </a>
                </div>
            ))}
        </div>
    );
};


export default BotSpeechBubble;