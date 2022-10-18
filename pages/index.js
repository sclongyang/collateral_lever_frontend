import NFTBox from "../components/PositionBox";
import { useMoralis } from "react-moralis"
import { useQuery } from "@apollo/client";
import GET_ACTIVE_ITEMS from "../constants/subgraphQueries";
import networkMapping from "../constants/networkMapping.json"
import { Button, Form } from "web3uikit";



export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    const { loading, error, data: positions } = useQuery(GET_ACTIVE_ITEMS)

    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const contractAddress = networkMapping[chainString].collateralLever[0]
    
    const approveAndListNFT = async (data) => {
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseEther(data.data[2].inputResult).toString()
        console.log(`begin approve nft`)
        //approve
        await runContractFunction({
            params: {
                contractAddress: nftAddress,
                abi: baseNFTAbi,
                functionName: "approve",
                params: {
                    to: marketplaceAddress,
                    tokenId: tokenId,
                }
            },
            onSuccess: () => listNFTOnMarketplace(nftAddress, tokenId, price),
            onError: (e) => handleCallBack(false, "", "approve nft", e),
        })
    }

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
                            <div>
                                {/* <PositionBox
                                    userAddress={userAddress}
                                    cTokenCollateralAddress={cTokenCollateralAddress}
                                    cTokenBorrowingAddress={cTokenBorrowingAddress}
                                    collateralAmountOfCollateralToken={collateralAmountOfCollateralToken}
                                    isShort={isShort}
                                    positionId={positionId}
                                /> */}
                                <div className="flex flex-col items-center">
                                    <Form
                                        id="OpenPositionForm"
                                        title="开仓"
                                        buttonConfig={{
                                            theme: "colored",
                                            color: "blue",
                                            text: "确认开仓"

                                        }}
                                        // onSubmit={approveAndListNFT}            

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
                                                type: "number",
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
                                                    "做多DAI",
                                                    "做空DAI",
                                                ]
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                        )
                    })
                )
            ) : (
                <div>Web3 Currently Not Enabled</div>
            )}
        </div>
    )
}
