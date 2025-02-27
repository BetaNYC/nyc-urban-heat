
type Props = {
    title: string,
    content?: string
}


const ResourceDefinitionCard = ({ title, content }: Props) => {
    return (
        <div className="flex gap-6 w-full">
            <div className="w-[444px] h-[300px] bg-slate-100 flex-shrink-0"></div>
            <div className="flex-1">
                <h2 className="mb-4 font-bold text-[18px]">{title}</h2>
                <p className="font-regular text-[1rem]">
                    {content}
                </p>
            </div>
        </div>
    )
}

export default ResourceDefinitionCard