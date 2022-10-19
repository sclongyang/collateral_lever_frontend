import { useWeb3Contract, useMoralis, provider } from "react-moralis";
import { Modal, useNotification, Input } from "web3uikit";
import collateralLeverAbi from "../constants/CollateralLever.json"
import networkMapping from "../constants/networkMapping.json"
import { useState, useEffect } from "react";
import { txGasLimit } from "../constants/const.js"
import { ethers } from 'ethers'

export default function ClosePositionModal({ isVisible, onClose, positionId }) {
    const dispatch = useNotification()
    const { isWeb3Enabled, account, chainId, web3 } = useMoralis()
    const { runContractFunction } = useWeb3Contract()
    const isGoerli = parseInt(chainId) == 5//仅支持goerli      


    const handleCallBack = (isSuccess, successMsg, title, errMsg) => {
        const msg = isSuccess ? successMsg : errMsg.message
        console.log(`callback:${isSuccess},${title}, ${msg}`)
        dispatch({
            type: isSuccess ? "success" : "error",
            message: msg,
            title: title,
            position: "topR"
        })
        onClose && onClose()
    }

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={async () => {
                const successMsg = "平仓成功"
                const title = "平仓返回值"
                onClose()
                if (isGoerli) {
                    const contractAddress = networkMapping[parseInt(chainId).toString()].collateralLever[0]
                    console.log(`开始平仓`)
                    const contract = new ethers.Contract(contractAddress, collateralLeverAbi, web3);
                    const signedContract = contract.connect(web3.getSigner())
                    const tx = await signedContract.closePosition(positionId)

                    // await runContractFunction({
                    //     contractAddress: contractAddress,
                    //     abi: collateralLeverAbi,
                    //     functionName: "closePosition",
                    //     params: {
                    //         positionId: positionId,
                    //     },
                    //     onSuccess: () => handleCallBack(true, successMsg, title),
                    //     onError: (e) => handleCallBack(false, successMsg, title, e),
                    // })
                }
            }
            }>
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
                        {isGoerli ? `确定要平仓?  positionId: ${positionId}` : "仅支持goerli测试网, 请切换网络"}
                    </p>
                </div>
            </div>
        </Modal>
    )
}