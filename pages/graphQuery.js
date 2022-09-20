import { useQuery, gql } from "@apollo/client"

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

const GraphQuery = () => {
  const { loading, error, data } = useQuery(GET_ACTIVE_ITEM)
  console.log(data)
  return <div>here is data</div>
}

export default GraphQuery
