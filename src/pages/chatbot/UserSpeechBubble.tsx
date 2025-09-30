type UserSpeechBubbleProps = {
  text: string;
};

const UserSpeechBubble = ({ text }: UserSpeechBubbleProps) => {
  return (
    <div className="flex justify-end">
      <div className="bg-blue-500 text-white rounded-xl rounded-br-lg px-4 py-2 max-w-xs lg:max-w-md">
        {text}
      </div>
    </div>
  );
};

export default UserSpeechBubble;
