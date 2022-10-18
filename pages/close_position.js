import { useMoralis } from "react-moralis";
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";
import PositionBox from "../components/PositionBox";

export default function ClosePosition() {
    const { isWeb3Enabled } = useMoralis()
    const { loading, error, data: positions } = useQuery(GET_ACTIVE_ITEMS)

    return (
        <div className="flex flex-wrap">
            {isWeb3Enabled ? (
                loading || !positions ? (
                    <div>Loading...</div>
                ) : (
                    positions.activePositions.map((position) => {
                        console.log(`active positionId: ${position.positionId}`)
                        const { userAddress, cTokenCollateralAddress, cTokenBorrowingAddress, collateralAmountOfCollateralToken, isShort, positionId } = position
                        return (
                            <PositionBox
                                userAddress={userAddress}
                                cTokenCollateralAddress={cTokenCollateralAddress}
                                cTokenBorrowingAddress={cTokenBorrowingAddress}
                                collateralAmountOfCollateralToken={collateralAmountOfCollateralToken}
                                isShort={isShort}
                                positionId={positionId}
                            />
                        )
                    })
                )
            ) : (
                <div>Web3 Currently Not Enabled</div>
            )}
        </div>
    )
}