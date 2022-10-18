import { Card } from "web3uikit"
import { useState } from "react"
import { ethers } from 'ethers'
import ClosePositionModal from "./ClosePositionModal"

export default function PositionBox({ userAddress, cTokenCollateralAddress, cTokenBorrowingAddress, collateralAmountOfCollateralToken, isShort, positionId }) {
    const [showModal, setShowModal] = useState(false)

    const handleCardClick = async () => {
        setShowModal(true)
    }

    return (
        <div>
            (<div>
                <ClosePositionModal
                    isVisible={showModal}
                    positionId={positionId}
                    onClose={() => setShowModal(false)}
                />
                <Card
                    title={positionId}
                    onClick={handleCardClick}
                >
                    <div className="p-2">
                        <div className="flex flex-col items-end gap-2">
                            <div>PositionId:{positionId}</div>
                            {/* <div>
                                {ethers.utils.formatEther()} ETH
                            </div> */}
                        </div>
                    </div>
                </Card>
            </div>)
        </div>
    )
}