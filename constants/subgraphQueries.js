import { gql } from "@apollo/client"

const GET_ACTIVE_ITEMS = gql`
{
  activePositions(
    first: 5
    orderBy: id
    orderDirection: desc
    where: {isClosed: false}
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
