import NFTBox from "../components/PositionBox";
import { useMoralis } from "react-moralis"
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";
import networkMapping from "../constants/networkMapping.json"


export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const { loading, error, data: positions } = useQuery(GET_ACTIVE_ITEMS)

    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const contractAddress = networkMapping[chainString].collateralLever[0]

    return (
        <div className="flex flex-wrap">
            {isWeb3Enabled ? (
                loading || !positions ? (
                    <div>Loading...</div>
                ) : (
                    positions.activePositions.map((position) => {
                        console.log(`active positions: ${position}`)
                        const { userAddress, cTokenCollateralAddress, cTokenBorrowingAddress, collateralAmountOfCollateralToken, isShort, positionId } = position
                        return
                        // return (
                        //     <PositionBox
                        //         userAddress={userAddress}
                        //         cTokenCollateralAddress={cTokenCollateralAddress}
                        //         cTokenBorrowingAddress={cTokenBorrowingAddress}
                        //         collateralAmountOfCollateralToken={collateralAmountOfCollateralToken}
                        //         isShort={isShort}
                        //         positionId={positionId}
                        //     />
                        // )
                    })
                )
            ) : (
                <div>Web3 Currently Not Enabled</div>
            )}
        </div>
    )
}
