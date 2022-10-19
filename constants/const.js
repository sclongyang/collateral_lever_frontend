import tokenAddressMapping from "../constants/cToken2token.json"

export const txGasLimit = 800000

export const getTokenAddressByName = (coinName) => {
    for (let i = 0; i < tokenAddressMapping.length; i++) {
        const element = tokenAddressMapping[i]
        if (element.tokenName === coinName) {
            return element.tokenAddress
        }
    }
}

export const getTokenNameByCTokenAddress = (cTokenAddress) => {
    for (let i = 0; i < tokenAddressMapping.length; i++) {
        const element = tokenAddressMapping[i]
        if (element.cTokenAddress === cTokenAddress) {
            return element.tokenName
        }
    }
}