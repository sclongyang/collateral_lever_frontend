import { useWeb3Contract } from "react-moralis";
import { Modal, useNotification, Input } from "web3uikit";
import collateralLeverAbi from "../constants/CollateralLever.json"
import networkMapping from "../constants/networkMapping.json"
import { useMoralis } from "react-moralis"

export default function ClosePositionModal({ isVisible, onClose, positionId }) {
    const dispatch = useNotification()
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"

    const contractAddress = networkMapping[chainString].collateralLever[0]

    const { runContractFunction: closePosition } = useWeb3Contract({
        contractAddress: contractAddress,
        abi: collateralLeverAbi,
        functionName: "closePosition",
        params: {
            positionId: positionId,
        }
    })

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
        setNewPrice("0")
    }

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                const successMsg = "平仓成功"
                const title = "平仓 返回值"
                closePosition({
                    onSuccess: () => handleCallBack(true, successMsg, title),
                    onError: (e) => handleCallBack(false, successMsg, title, e),
                })
            }
            }>
        </Modal>
    )
}