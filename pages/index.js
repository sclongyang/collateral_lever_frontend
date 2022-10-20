import networkMapping from "../constants/networkMapping.json"
import { txGasLimit, getTokenAddressByName } from "../constants/const.js"
import { Modal, Form, useNotification } from "web3uikit";
import { ethers } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis";
import collateralLeverAbi from "../constants/CollateralLever.json"
import erc20Abi from "../constants/ERC20Abi.json"
import { useState, useEffect } from "react";


export default function Home() {
    const [isModalVisible, setModalVisible] = useState(false)
    const { isWeb3Enabled, chainId, account, web3 } = useMoralis()
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()


    const [popMsg, setPopMsg] = useState("")
    const [needRefresh, setNeedRefresh] = useState(false)
    useEffect(() => {
        if (isWeb3Enabled) {
            console.log(`refresing ui`)
            setNeedRefresh(false)
        }
    }, [isWeb3Enabled, account, chainId, needRefresh])

    const openPosition = async (data) => {
        const coinPair = data.data[0].inputResult.toString()
        const coinArray = coinPair.split("-")
        const tokenBase = getTokenAddressByName(coinArray[0])
        const tokenQuoteName = coinArray[1]
        const tokenQuote = getTokenAddressByName(tokenQuoteName)
        const investmentAmount = data.data[1].inputResult.toString() || "0"
        const lever = data.data[2].inputResult.toString()
        const longOrShort = data.data[3].inputResult.toString()        
        const investmentCoinAddress = tokenBase

        const chainIdDec = parseInt(chainId)
        const isGoerli = chainIdDec == 5 //仅支持goerli
        if (!coinPair.includes("-") || isNaN(investmentAmount) || investmentAmount === "0" || lever.includes(":") || longOrShort.includes(":") || !isGoerli) {
            setPopMsg(isGoerli ? "有参数未填或错误, 请按F5刷新后重填" : "仅支持goerli测试网, 请切换网络")
            setModalVisible(true)
            return
        }
        const contractAddress = networkMapping[chainIdDec.toString()].collateralLever[0]
        investmentAmount = ethers.utils.parseUnits(investmentAmount, 18)        
        const isShort = longOrShort.includes("short")
        console.log(`openPosition: tokenBase:${tokenBase},tokenQuote:${tokenQuote},investmentAmount:${investmentAmount},lever:${lever},isshort:${isShort}`)
        //approve
        const erc20 = new ethers.Contract(investmentCoinAddress, erc20Abi, web3);
        const signedErc20 = erc20.connect(web3.getSigner())
        console.log(`begin approve`)
        const txApprove = await signedErc20.approve(contractAddress, investmentAmount)
        // await txApprove.wait(1)

        const contract = new ethers.Contract(contractAddress, collateralLeverAbi, web3);
        const signedContract = contract.connect(web3.getSigner())
        console.log(`begin open position`)

        await signedContract.openPosition(tokenBase, tokenQuote, investmentAmount, false, lever, isShort, {
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
                    <div>说明: goerli流动性不足,有些'币对'借贷会失败,所以前端做了限制,仅支持一个币对做多 (fork mainnet可以投入另一个币种,也可以做空)</div>
                    <div>提示: 需要先持有DAI, 可去uniswap goerli兑换, goerli的DAI地址为: 0x2899a03ffDab5C90BADc5920b4f53B0884EB13cC</div>
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
                                name: "要投入的金额(单位:DAI)",
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
                                    // "Market-short(做空) DAI",
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
