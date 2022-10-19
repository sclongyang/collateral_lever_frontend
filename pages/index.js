import networkMapping from "../constants/networkMapping.json"
import { txGasLimit, getTokenAddressByName } from "../constants/const.js"
import { Modal, Form, useNotification } from "web3uikit";
import { ethers } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis";
import collateralLeverAbi from "../constants/CollateralLever.json"
import { useState, useEffect } from "react";


export default function Home() {
    const [isModalVisible, setModalVisible] = useState(false)
    const { isWeb3Enabled, chainId, account, web3 } = useMoralis()
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    const [popMsg, setPopMsg] = useState("")
    const [needRefresh, setNeedRefresh] = useState(false)
    // useEffect(() => {
    //     if (isWeb3Enabled) {
    //     }        

    // }, [isWeb3Enabled, account, chainId])

    const openPosition = async (data) => {
        const coinPair = data.data[0].inputResult.toString()
        const coinArray = coinPair.split("-")
        const tokenBase = getTokenAddressByName(coinArray[0])
        const tokenQuote = getTokenAddressByName(coinArray[1])
        const investmentCoin = data.data[1].inputResult.toString()
        const investmentAmount = data.data[2].inputResult.toString() || "0"
        const lever = data.data[3].inputResult.toString()
        const longOrShort = data.data[4].inputResult.toString()

        const chainIdDec = parseInt(chainId)
        const isGoerli = chainIdDec == 5 //仅支持goerli
        if (!coinPair.includes("-") || investmentCoin.includes(":") || isNaN(investmentAmount) || investmentAmount === "0" || lever.includes(":") || longOrShort.includes(":") || !isGoerli) {
            setPopMsg(isGoerli ? "有参数未填或错误, 请重新填写" : "仅支持goerli测试网, 请切换网络")
            setModalVisible(true)
            return
        }
        const contractAddress = networkMapping[chainIdDec.toString()].collateralLever[0]
        investmentAmount = ethers.utils.parseUnits(investmentAmount, 18).toString()
        const investmentIsQuote = investmentCoin == tokenQuote
        const isShort = longOrShort.includes("short")

        console.log(`print openposition params:`)
        console.log(tokenBase)
        console.log(tokenQuote)
        console.log(investmentAmount)
        console.log(investmentIsQuote)
        console.log(lever)
        console.log(isShort)
        console.log(`begin open position`)
        const contract = new ethers.Contract(contractAddress, collateralLeverAbi, web3);
        const signedContract = contract.connect(web3.getSigner())
        await signedContract.openPosition(tokenBase, tokenQuote, investmentAmount, investmentIsQuote, lever, isShort, {
            gasLimit: txGasLimit
        })
        setNeedRefresh(true)
        // await runContractFunction({
        //     params: {
        //         contractAddress: contractAddress,
        //         abi: collateralLeverAbi,
        //         functionName: "openPosition",
        //         params: {
        //             tokenBase: tokenBase,
        //             tokenQuote: tokenQuote,
        //             investmentAmount: investmentAmount,
        //             investmentIsQuote: investmentCoin == tokenQuote,
        //             lever: lever,
        //             isShort: longOrShort.includes("short"),
        //         }
        //     },
        //     onSuccess: () => handleCallBack(true, "openPosition success!", "openPosition"),
        //     onError: (e) => handleCallBack(false, "", "openPosition", e),
        // })
    }

    const handleCallBack = (isSuccess, successMsg, title, errMsg) => {
        const msg = isSuccess ? successMsg : errMsg
        console.log(msg)
        dispatch({
            type: isSuccess ? "success" : "error",
            message: msg,
            title: title,
            position: "topR"
        })
    }

    const OnCloseModal = () => {
        setModalVisible(false)
    }

    return (
        <div className="flex flex-col items-center">
            {isWeb3Enabled ? (
                <div className="flex flex-col items-center">
                    <Modal
                        title="WARNING"
                        isVisible={isModalVisible}
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
                                    {popMsg}
                                </p>
                            </div>
                        </div>
                    </Modal>
                    <Form
                        id="OpenPositionForm"
                        title="开仓"
                        buttonConfig={{
                            theme: "colored",
                            color: "green",
                            text: "确认开仓",
                            disabled: false,
                            size: "large"

                        }}
                        onSubmit={openPosition}

                        data={[
                            {
                                "name": "coinPair",
                                "type": "radios",
                                "value": "币对:",
                                "options": [
                                    "DAI-COMP",
                                    //   "DAI_USDC",                                                  
                                ],
                            },
                            {
                                "name": "investmentCoin",
                                "type": "radios",
                                "value": "要投入的币种:",
                                "options": [
                                    "DAI",
                                    "COMP",
                                ]
                            },
                            {
                                name: "要投入的币种金额(例如 0.03)",
                                type: "text",
                                value: "",
                                key: "amount",
                            },
                            {
                                "name": "lever",
                                "type": "radios",
                                "value": "杠杆:",
                                "options": [
                                    "2",
                                    "3",
                                ]
                            },
                            {
                                "name": "longShort",
                                "type": "radios",
                                "value": "做多做空:",
                                "options": [
                                    "Market-long(做多) DAI",
                                    "Market-short(做空) DAI",
                                ]
                            },
                        ]}
                    />
                </div>
            ) : (
                <div>请连接钱包</div>
            )}
        </div>
    )
}
