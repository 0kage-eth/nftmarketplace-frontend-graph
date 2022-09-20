import { Avatar, Modal, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftMarketPlaceAbi from "../constants/NFTMarketPlace.json"

const BuyNFTModal = ({
    isVisible,
    onClose,
    price,
    nftAddress,
    nftMarketPlaceAddress,
    tokenId,
    imageUrl,
    title,
    description,
}) => {
    const dispatch = useNotification()
    console.log(imageUrl)
    console.log(price)
    const { runContractFunction: buyNFT, onFetching } = useWeb3Contract({
        abi: nftMarketPlaceAbi,
        contractAddress: nftMarketPlaceAddress,
        functionName: "buyNFT",
        msgValue: price,
        params: { nftAddress: nftAddress, tokenId: tokenId },
    })

    const successfulBuyHandler = async (txReceipt) => {
        await txReceipt.wait(1)
        dispatch({
            type: "success",
            title: "Purchase Successful!",
            message: "Congrats! You own this NFT. Refresh the page to check ownership",
            position: "topR",
        })
    }

    return (
        <div>
            <Modal
                isVisible={isVisible}
                okText="Buy this!"
                cancelText="Cancel"
                onOk={() =>
                    buyNFT({
                        onError: (e) => {
                            console.log(e)
                        },
                        onSuccess: successfulBuyHandler,
                    })
                }
                onCancel={() => onClose()}
                onCloseButtonPressed={() => onClose()}
            >
                <div
                    style={{
                        display: "grid",
                        placeItems: "center",
                    }}
                >
                    <div>
                        <Avatar image={imageUrl} theme="image" size={80} />
                        {/* <Image loader={() => imageUrl} src={imageUrl} height="100" width="100" /> */}
                    </div>
                    <div className="font-bold">{ethers.utils.formatEther(price)} ETH</div>
                    <div>{title}</div>
                    <div>{description}</div>
                </div>
            </Modal>
        </div>
    )
}

export default BuyNFTModal
