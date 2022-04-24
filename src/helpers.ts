import { ethers } from "ethers"

export const getPoolImmutables = async (poolContract: ethers.Contract) => {
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee()
  ])

  const immutables = {
    token0: token0,
    token1: token1,
    fee: fee
  }
  return immutables
}

export const getPoolState = async (poolContract: ethers.Contract) => {
  const slot = poolContract.slot0()

  const state = {
    sqrtPriceX96: slot[0]
  }

  return state
}