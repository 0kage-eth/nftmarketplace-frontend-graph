import Image from "next/image"
import { useEffect, useState } from "react"
import { useMoralis } from "react-moralis"
import { useWeb3Contract } from "react-moralis"
import basicNftAbi from "../constants/BasicNFT.json"
import { Card } from "web3uikit"
import { ethers } from "ethers"
import UpdateNFTModal from "./UpdateNFTModal"
import BuyNFTModal from "./BuyNFTModal"

/**
 * @notice utility function to reduce size of an address
 * @param {string} address input address that needs to be shorted
 * @param {number} showLength length to which address needs to be shortened. Typically use 15
 * @param {string} separator separator text to be used for shortening address. Typically use '...'
 * @returns reduced address
 */

const showAddress = (address, showLength, separator) => {
    // showLength is length of shortened address
    if (showLength >= address.length) {
        return address
    }

    const separatorLength = separator.length

    const startLength = Math.ceil((showLength - separatorLength) / 2)

    const endLength = showLength - separatorLength - startLength

    return (
        address.substring(0, startLength) +
        separator +
        address.substring(address.length - endLength)
    )
}

/**
 * @notice component displays a NFT card with image, price, description and buy/update buttons
 * @param {object} param0 {nftMarketplaceAddress, nft address, price of nft, unique token id of nft and owner address}
 * @returns
 */
export const NFTDisplayCard = ({ nftMarketplaceAddress, nftAddress, price, tokenId, owner }) => {
    const [imgUrl, setImgUrl] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [showUpdateModal, setShowUpdateModal] = useState(false)
    const [showBuyModal, setShowBuyModal] = useState(false)

    const { isWeb3Enabled, account } = useMoralis()
    const {
        data,
        error,
        runContractFunction: getTokenURI,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: basicNftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: { tokenId: tokenId },
    })

    const isOwner = account == owner || owner == undefined ? true : false

    const cardClickHandler = () => {
        isOwner ? setShowUpdateModal(true) : setShowBuyModal(true)
    }
    const hideUpdateModal = () => {
        setShowUpdateModal(false)
    }

    const hideBuyModal = () => {
        setShowBuyModal(false)
    }

    const updateUI = async () => {
        const tokenUri = await getTokenURI()
        if (tokenUri) {
            const requestUrl = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestUrl)).json()
            const image = tokenURIResponse.image
            if (image) {
                const imageUrl = image.replace("ipfs://", "http://ipfs.io/ipfs/")
                setImgUrl(imageUrl)
            }
            setTitle(tokenURIResponse.name)
            setDescription(tokenURIResponse.description)
        }

        console.log("output", tokenUri)
    }

    const nftCard = () => {
        const ownedBy = isOwner ? "you" : showAddress(owner, 15, "...")
        return (
            <div
                style={{
                    width: "500px",
                }}
            >
                <UpdateNFTModal
                    isVisible={showUpdateModal}
                    onCloseModal={hideUpdateModal}
                    price={price}
                    nftMarketPlaceAddress={nftMarketplaceAddress}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                />
                <BuyNFTModal
                    isVisible={showBuyModal}
                    price={price}
                    nftMarketPlaceAddress={nftMarketplaceAddress}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    imageUrl={imgUrl}
                    onClose={hideBuyModal}
                    title={title}
                    description={description}
                ></BuyNFTModal>
                <Card title={title} description={description} onClick={cardClickHandler}>
                    <div>#{tokenId}</div>
                    <div className="italic text-sm">Owned by {ownedBy}</div>
                    <div>
                        <Image loader={() => imgUrl} src={imgUrl} height="200" width="200" />
                    </div>
                    <div className="font-bold">{ethers.utils.formatEther(price)} ETH</div>
                </Card>
            </div>
        )
    }

    useEffect(() => {
        console.log("calling update ui")
        isWeb3Enabled && updateUI()
    }, [isWeb3Enabled])

    return <div>{imgUrl ? nftCard() : <div>Loading image...</div>}</div>
}
