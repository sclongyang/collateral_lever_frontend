import networkMapping from "../constants/networkMapping.json"
import { Form, useNotification } from "web3uikit";
import {ethers} from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis";
import collateralLeverAbi from "../constants/CollateralLever.json"


export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const contractAddress = networkMapping[chainString].collateralLever[0]
    const {runContractFunction} = useWeb3Contract()
    const dispatch = useNotification()

    const openPosition = async (data) => {
        const coinPair = data.data[0].inputResult.toString()
        const coinArray = coinPair.split("-")
        const tokenBase = coinArray[0]
        const tokenQuote = coinArray[1]
        const investmentCoin = data.data[1].inputResult.toString()
        const investmentAmount = data.data[2].inputResult.toString()
        const lever = data.data[3].inputResult.toString()
        const longOrShort = data.data[4].inputResult .toString()       
        investmentAmount = ethers.utils.parseUnits(investmentAmount,18).toString()        
        
        console.log(`:${longOrShort}`)
        console.log(`isshort?:${longOrShort.includes("short")}`)
        console.log(`isquote:${investmentCoin == tokenQuote}`)
        console.log(`begin open position`)        
        await runContractFunction({
            params: {
                contractAddress: contractAddress,
                abi: collateralLeverAbi,
                functionName: "openPosition",
                params: {
                    tokenBase: tokenBase,
                    tokenQuote: tokenQuote,
                    investmentAmount: investmentAmount,
                    investmentIsQuote: investmentCoin == tokenQuote,
                    lever: lever,
                    isShort: longOrShort.includes("short"),                    
                }
            },
            onSuccess: () => handleCallBack(true, "openPosition success!", "openPosition"),
            onError: (e) => handleCallBack(false, "", "openPosition", e),
        })
    }

    const handleCallBack = (isSuccess, successMsg, title, errMsg)=>{
        const msg = isSuccess?successMsg:errMsg
        console.log(msg)
        dispatch({
            type: isSuccess?"success":"error",
            message: msg,
            title: title,
            position: "topR"
        })
    }

    return (
        <div className="flex flex-wrap">
            {isWeb3Enabled ? (
                <div className="flex flex-col items-center">
                    <Form
                        id="OpenPositionForm"
                        title="开仓"
                        buttonConfig={{
                            theme: "colored",
                            color: "blue",
                            text: "确认开仓"

                        }}
                        onSubmit={openPosition}

                        data={[
                            {
                                "name": "coinPair",
                                "type": "radios",
                                "value": "币对(其他币对测试网不支持):",
                                "options": [
                                    "DAI-COMP",
                                    //   "DAI_USDC",                                                  
                                ]
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
                <div>Web3 Currently Not Enabled</div>
            )}
        </div>
    )
}
