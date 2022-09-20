import { gql } from "@apollo/client"

const GET_ACTIVE_ITEM = gql`
  {
    activeNFTs(first: 5, where: { buyer: null }) {
      id
      buyer
      owner
      nftAddress
      tokenId
      price
    }
  }
`

export default GET_ACTIVE_ITEM
