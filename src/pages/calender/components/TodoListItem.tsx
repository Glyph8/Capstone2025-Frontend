interface Props{
    title: string;
    handleClick : ()=>void;
}

export const TodoListItem = ({title, handleClick}:Props) =>{

    return(
        <button className="inline-flex w-full h-12 items-center justify-center px-1 pt-2 border-b-1" 
        onClick={handleClick} type="button" aria-label={title}>
            <span className="w-full h-full text-black text-base font-medium font-['Pretandard'] leading-snug
            overflow-x-scroll whitespace-nowrap scrollbar-hide">
                {title}
            </span>
        </button>
    )
}