import { NtaProfileData } from "../types"

type Props = {
    //@ts-ignore
    allFeatures: NtaProfileData["allFeatures"],
    clickedIndex: string
}

const OverviewProfileChart = ({ allFeatures, clickedIndex }: Props) => {
    console.log(allFeatures, clickedIndex)

    
    return (
        <div></div>
    )
}

export default OverviewProfileChart