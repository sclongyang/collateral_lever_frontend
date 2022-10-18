import { Modal, Card } from "web3uikit"
import { useState } from "react"
import { ethers } from 'ethers'
import ClosePositionModal from "./ClosePositionModal"
import { useMoralis, useWeb3Contract } from "react-moralis";
import cToken2TokenMapping from "../constants/cToken2token.json"

export default function PositionBox({ userAddress, cTokenCollateralAddress, cTokenBorrowingAddress, collateralAmountOfCollateralToken, isShort, positionId }) {
    const [showModal, setShowModal] = useState(false)
    const [showWaring, setShowWaring] = useState(false)
    const { isWeb3Enabled, chainId } = useMoralis()
    const { runContractFunction } = useWeb3Contract()

    const collateralTokenName = cToken2TokenMapping[cTokenCollateralAddress.toLowerCase()].tokenName[0]
    const borrowingTokenName = cToken2TokenMapping[cTokenBorrowingAddress.toLowerCase()].tokenName[0]

    collateralAmountOfCollateralToken = ethers.utils.formatUnits(collateralAmountOfCollateralToken, "ether")
    const handleCardClick = async () => {
        const chainIdDec = parseInt(chainId)
        const isGoerli = chainIdDec == 5 //仅支持goerli
        if (!isGoerli) {
            setShowWaring(true)
        } else {
            setShowModal(true)
        }
    }

    const OnCloseModal = () => {
        setShowWaring(false)
    }

    return (
        <div>
            <ClosePositionModal
                isVisible={showModal}
                positionId={positionId}
                onClose={() => setShowModal(false)}
            />
            <Modal
                title="WARNING"
                isVisible={showWaring}
                onCancel={OnCloseModal}
                onCloseButtonPressed={OnCloseModal}
                onOk={OnCloseModal}>
                <div
                    style={{
                        display: 'grid',
                        placeItems: 'center',
                        width: '100%'
                    }}
                >
                    <div
                        style={{
                            display: 'flex'
                        }}
                    >
                        <p
                            style={{
                                fontWeight: 600,
                                marginRight: '1em'
                            }}
                        >
                            仅支持goerli测试网, 请切换网络
                        </p>
                    </div>
                </div>
            </Modal>
            <Card
                // title={positionId}
                onClick={handleCardClick}
            >
                <div className="p-2">
                    <div className="flex flex-col items-center gap-2">
                        <div>PositionId:{positionId}</div>
                        <div>抵押物:{collateralTokenName}</div>
                        <div>贷出物:{borrowingTokenName}</div>
                        <div>加杠杆后抵押额度:{collateralAmountOfCollateralToken}</div>
                        <div>{isShort ? "做空" : "做多"}</div>
                        <div>点击平仓</div>
                    </div>
                </div>
            </Card>
        </div>
    )
}