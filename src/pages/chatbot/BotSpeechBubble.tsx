import type { RecommendedProgram } from "../../types/types";

type BotSpeechBubbleProps = {
    text: string;
    recommendedProgramList?: RecommendedProgram[];
};

const BotSpeechBubble = ({ text, recommendedProgramList }: BotSpeechBubbleProps) => {
    return (
        <div className="w-93 bg-[#FCFFFF] rounded-tr-[50px] rounded-br-[50px] p-4 space-y-3 shadow-md">
            <div className="text-sm whitespace-pre-line">{text}</div>

            {recommendedProgramList?.map((program, idx) => (
                <div key={idx} className="bg-[#F0F4F8] p-3 rounded-lg space-y-1 text-sm">
                    <div className="font-semibold">{program.title}</div>
                    <a href={program.url} className="text-blue-600 underline" target="_blank">
                        프로그램 링크
                    </a>
                    <div>{program.applicationPeriod}</div>
                    <div>{program.duration}</div>
                    <div>{program.targetAudience}</div>
                    <div>{program.selectionMethod}</div>
                    <div>{program.purposeOfTheActivity}</div>
                    <div>{program.participationBenefitsAndExpectedOutcomes}</div>
                    <div>{program.process}</div>
                    <div>{program.modeOfOperation}</div>
                </div>
            ))}
        </div>
    );
};

export default BotSpeechBubble;