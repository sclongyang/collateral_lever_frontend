import { useMoralis } from "react-moralis";
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";
import PositionBox from "../components/PositionBox";

export default function ClosePosition() {
    const { isWeb3Enabled, account } = useMoralis()    
    const { loading, error, data: positions } = useQuery(GET_ACTIVE_ITEMS, {
        variables: {
          userAddress: account
        },
      });
    console.log(account)

    return (
        <div className="flex flex-wrap  gap-1">
            {isWeb3Enabled ? (
                loading || !positions ? (
                    <div>Loading...</div>
                ) : (
                    positions.activePositions.length == 0 ?
                        (<div>你目前没有仓位</div>)
                        :
                        (positions.activePositions.map((position) => {
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
                                    key={`${positionId}`}
                                />
                            )
                        })

                        )
                )
            ) : (
                <div>请连接钱包</div>
            )}
        </div>
    )
}