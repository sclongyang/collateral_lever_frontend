import { gql } from "@apollo/client"

const GET_ACTIVE_ITEMS = gql`
  query ActivePosition($userAddress:String!) {
  activePositions(
    first: 5
    orderBy: id
    orderDirection: desc
    where: {userAddress: $userAddress}
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
// const GET_ACTIVE_ITEMS = gql`
//   query ActivePositions($address:String!){
//     activePositions(
//     first: 20
//     orderBy: id
//     orderDirection: desc
//     where: {isClosed: false, userAddress: $address}
//     ) {
//         id
//         userAddress
//         cTokenCollateralAddress
//         cTokenBorrowingAddress
//         collateralAmountOfCollateralToken
//         isShort
//         positionId
//     }
//   }
// `
export default GET_ACTIVE_ITEMS
