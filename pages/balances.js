import { ethers } from "ethers"
import { useWeb3Contract, useMoralis } from "react-moralis"
import nftMarketPlaceAbi from "../constants/NFTMarketPlace.json"
import networkMapping from "../constants/networkMapping.json"
import { Card, Button, useNotification } from "web3uikit"
import { useEffect, useState } from "react"

const Balances = () => {
  const [accountBalance, setAccountBalance] = useState("0")
  const [updateWithdrawal, setUpdateWithdrawal] = useState(false)
  const { chainId } = useMoralis()
  const chainString = chainId ? parseInt(chainId).toString() : "31337"
  const { runContractFunction, onLoading, onFetching } = useWeb3Contract()
  const dispatch = useNotification()

  const withdrawSuccessHandler = () => {
    console.log("withdrawal successful..dispatching notification")
    dispatch({
      type: "success",
      title: "Withdrawal successful",
      description: "Funds successfully transfered to your wallet",
      position: "topR",
    })
    setUpdateWithdrawal(true)
  }
  const showBalance = () => {
    console.log("showing balance")
    const showBalanceOptions = {
      abi: nftMarketPlaceAbi,
      contractAddress: networkMapping[chainString].NftMarketPlace[0],
      functionName: "getAccountBalance",
      params: {},
    }

    runContractFunction({
      params: showBalanceOptions,
      onSuccess: (result) => {
        setAccountBalance(ethers.utils.formatEther(result))
      },
      onError: (e) => console.log(e),
    })
  }
  const withdraw = () => {
    console.log("withdraw balance")
    const withdrawOptions = {
      abi: nftMarketPlaceAbi,
      contractAddress: networkMapping[chainString].NftMarketPlace[0],
      functionName: "withdrawProceeds",
      params: {},
    }
    runContractFunction({
      params: withdrawOptions,
      onSuccess: () => withdrawSuccessHandler(),
      onError: (e) => console.log(e),
    })
  }

  // calculate show balance whenever page gets initiated
  useEffect(() => {
    showBalance()
  }, [])

  useEffect(() => {
    showBalance()
  }, [updateWithdrawal])

  return (
    <div>
      <Card
        description="Current Withdrawable Balance"
        title={`${accountBalance} ETH`}>
        <Button onClick={withdraw} text="Withdraw Balance" theme="primary" />
      </Card>
    </div>
  )
}

export default Balances
