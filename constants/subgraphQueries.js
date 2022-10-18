import { gql } from "@apollo/client"

const GET_ACTIVE_ITEMS = gql`
  query ActivePosition($userAddress:String!) {
  activePositions(
    first: 5
    orderBy: id
    orderDirection: desc
    where: {isClosed:false, userAddress: $userAddress}
  ) {
        id
        userAddress
        cTokenCollateralAddress
        cTokenBorrowingAddress
        collateralAmountOfCollateralToken
        isShort
        positionId
  }
}
`
export default GET_ACTIVE_ITEMS
