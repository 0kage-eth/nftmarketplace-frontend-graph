import { Modal, Input, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import nftMarketPlaceAbi from "../constants/NFTMarketPlace.json"
import { ethers } from "ethers"
import { useState } from "react"
const UpdateNFTModal = ({
    isVisible,
    price,
    nftAddress,
    nftMarketPlaceAddress,
    tokenId,
    onCloseModal,
}) => {
    console.log("nftMarketPlaceAddress", nftMarketPlaceAddress)

    const [revisedPrice, setRevisedPrice] = useState(price)
    const dispatch = useNotification()
    const { runContractFunction: updateNFT, isFetching } = useWeb3Contract({
        abi: nftMarketPlaceAbi,
        contractAddress: nftMarketPlaceAddress,
        functionName: "updateNFT",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            revisedPrice: ethers.utils.parseEther(revisedPrice) || 0,
        },
    })

    const successfulUpdateHandler = async (txReceipt) => {
        await txReceipt.wait(1)
        dispatch({
            type: "success",
            title: "Update successful",
            message: "You successfully revised price for current NFT. Please refresh",
            position: "topR",
        })
        onCloseModal && onCloseModal()
    }

    return (
        <div>
            <Modal
                isVisible={isVisible}
                cancelText="Discard Changes"
                okText="Save Changes"
                isOkDisabled={isFetching}
                isCancelDisabled={isFetching}
                onCloseButtonPressed={onCloseModal}
                onOk={() => {
                    updateNFT({
                        onError: (error) => console.log(error),
                        onSuccess: successfulUpdateHandler,
                    })
                }}
                onCancel={onCloseModal}
            >
                <div style={{ padding: "20px 0 20px 0" }}>
                    <Input
                        label="Price in ETH"
                        name="Update Price"
                        type="number"
                        onChange={
                            (event) =>
                                event.target.value !== revisedPrice &&
                                setRevisedPrice(event.target.value) //update revised price only if there is a change in price
                        }
                    />
                </div>
            </Modal>
        </div>
    )
}

export default UpdateNFTModal
