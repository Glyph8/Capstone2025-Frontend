
type UserSpeechBubbleProps = {
    text: string;
}

const UserSpeechBubble = ({ text }: UserSpeechBubbleProps) => {

    return (
        <div className="flex flex-col w-full items-end">
            <div className="w-[90%] min-h-16 bg-[#FCFFFF] rounded-tl-[50px] rounded-bl-[50px] p-3">
                <div>
                    {text}
                </div>
            </div>
        </div>
    )
}

export default UserSpeechBubble;