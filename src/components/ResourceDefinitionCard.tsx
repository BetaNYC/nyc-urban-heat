
type Props = {
    title: string,
    content?: string
}


const ResourceDefinitionCard = ({ title }: Props) => {
    return (
        <div className="flex gap-6 w-full">
            <div className="w-[444px] h-[300px] bg-slate-100 flex-shrink-0"></div>
            <div className="flex-1">
                <h2 className="font-bold text-[18px]">{title}</h2>
                <p className="font-regular text-[1rem]">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>
        </div>
    )
}

export default ResourceDefinitionCard