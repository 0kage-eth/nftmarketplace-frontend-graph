import { useMoralis } from "react-moralis"
import { NFTDisplayCard } from "../components/NFTDisplayCard"
import networkMapping from "../constants/networkMapping.json"
import GET_ACTIVE_ITEM from "../constants/SubGraphQueries"
import { useQuery } from "@apollo/client"

const Home = () => {
  console.log("Home page!")

  // populate active NFT's on first page loading
  // const {
  //     data: activeNFTs,
  //     error,
  //     isLoading: fetching,
  // } = useMoralisQuery("ActiveNFT", (query) => query.limit(10).descending("tokenId"))

  const { isWeb3Enabled, chainId } = useMoralis()
  const chainIdString = chainId ? parseInt(chainId).toString() : "31337"
  console.log("chain id string", chainIdString)
  const marketPlaceAddress = networkMapping[chainIdString]["NftMarketPlace"][0]

  const { loading, error, data } = useQuery(GET_ACTIVE_ITEM)
  const nftListings = () => {
    return (
      data &&
      data.activeNFTs.map((nft, indx) => {
        const { tokenId, nftAddress, price, owner } = nft
        console.log(
          `token ${tokenId}, nftAddress ${nftAddress} price: ${price} ownwer: ${owner}`
        )
        return (
          <div>
            {/* <div id={indx}>
                          nft address: {nftAddress}, token id: {tokenId}, owner: {owner}, price:{" "}
                          {price}
                      </div> */}
            <NFTDisplayCard
              price={price}
              nftMarketplaceAddress={marketPlaceAddress}
              tokenId={tokenId}
              owner={owner}
              nftAddress={nftAddress}
            />
          </div>
        )
      })
    )
  }
  return isWeb3Enabled ? (
    <div>
      {loading ? <div>"Fetching NFT list..."</div> : nftListings() /*  */}
    </div>
  ) : (
    <div>"Enable Web3 by connecting your wallet!"</div>
  )
}

export default Home
