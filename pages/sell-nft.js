import { Form, useNotification } from "web3uikit"
import nftAddressAbi from "../constants/BasicNFT.json"
import nftMarketPlaceAbi from "../constants/NFTMarketPlace.json"
import { useWeb3Contract, useMoralis } from "react-moralis"
import networkMapping from "../constants/networkMapping.json"
import { ethers } from "ethers"

const SellNFT = () => {
    const { runContractFunction, isLoading, isFetching } = useWeb3Contract()
    const dispatch = useNotification()

    const { chainId } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const nftMarketPlaceAddress = networkMapping[chainString].NftMarketPlace[0]

    const approveAndList = async (data) => {
        console.log("Approving NFT for sale...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult - 1
        const price = ethers.utils.parseEther(data.data[2].inputResult).toString()

        const approveParams = {
            abi: nftAddressAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: { to: nftMarketPlaceAddress, tokenId: tokenId.toString() },
        }

        await runContractFunction({
            params: approveParams,
            onSuccess: () => {
                listNFT(nftAddress, tokenId, price)
            },
            onError: (e) => console.log(e),
        })
    }

    /**
     * @notice this function gets called once contract is approved
     * @dev call the approveAndList function in NFT Marketplace
     */
    const listNFT = async (nftAddress, tokenId, price) => {
        const listNFTParams = {
            abi: nftMarketPlaceAbi,
            contractAddress: nftMarketPlaceAddress,
            functionName: "listNFT",
            params: { nftAddress: nftAddress, tokenId: tokenId, price: price },
        }
        await runContractFunction({
            params: listNFTParams,
            onError: (e) => console.log(e),
            onSuccess: handleListingSuccess,
        })
    }

    const handleListingSuccess = async (response) => {
        dispatch({
            title: "Listing Success",
            message: "NFT is successfully listed. You are ready for sale!",
            type: "success",
            position: "topR",
        })
    }

    return (
        <div>
            <Form
                onSubmit={approveAndList}
                title="Sell NFTs"
                data={[
                    {
                        inputWidth: "50%",
                        name: "nft Address",
                        type: "text",
                        key: "nftAddress",
                        value: "",
                        validation: { required: true },
                    },
                    {
                        inputWidth: "50%",
                        name: "token id",
                        key: "tokenId",
                        type: "number",
                        value: "",
                        validation: { required: true },
                    },
                    {
                        inputWidth: "50%",
                        name: "price (in ETH)",
                        type: "text",
                        key: "price",
                        value: "",
                        validation: { required: true },
                    },
                ]}
            />
        </div>
    )
}

export default SellNFT
