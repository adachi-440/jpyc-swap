import { BigNumber, ethers } from 'ethers'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { abi as UniswapV3Factory_ABI } from '@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json'
import { abi as SwapRouterABI } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json'
import { getPoolImmutables, getPoolState } from './helpers'
import ERC20ABI from './abi.json'
import { Token } from '@uniswap/sdk-core'
import { Pool } from '@uniswap/v3-sdk'

const name0 = 'JPY Coin'
const symbol0 = 'JPYC'
const decimals0 = 18
const address0 = '0x564e849C68350248B441e1BC592aC8b4e07ef1E9'

const name1 = 'ETH'
const symbol1 = 'ETH'
const decimals1 = 18
const address1 = '0xc778417E063141139Fce010982780140Aa0cD5Ab'

export class JPYCSwap {
  poolAddress: string
  poolContract: ethers.Contract
  web3Provider: ethers.providers.Web3Provider
  chainId: number
  provider: ethers.providers.Provider
  swapRouterAddress: string


  constructor(web3Provider: ethers.providers.Web3Provider, chainId: number) {
    this.web3Provider = web3Provider
    this.chainId = chainId

    if (chainId === 1) {
      const INFURA_URL_MAINNET = process.env.NEXT_PUBLIC_INFURA_URL_MAINNET
      this.provider = new ethers.providers.JsonRpcProvider(INFURA_URL_MAINNET)
      this.swapRouterAddress = "0x691C9c0B050C2C3D46DAD37B1B4c3666F13ECfcE"
    } else {
      const INFURA_URL_TESTNET = process.env.NEXT_PUBLIC_INFURA_URL_TESTNET
      this.provider = new ethers.providers.JsonRpcProvider(INFURA_URL_TESTNET)
      this.swapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
    }

    const uniswapContract = new ethers.Contract(
      '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      UniswapV3Factory_ABI,
      this.provider,
    )

    this.poolAddress = uniswapContract.getPool(
      address0,
      address1,
      10000,
    )

    this.poolContract = new ethers.Contract(
      this.poolAddress,
      IUniswapV3PoolABI,
      this.provider
    )
  }

  exchangeRate = async () => {
    const [token0address, token1address, fee, liquidity, slot] =
      await Promise.all([
        this.poolContract.token0(),
        this.poolContract.token1(),
        this.poolContract.fee(),
        this.poolContract.liquidity(),
        this.poolContract.slot0(),
      ]);
    const TokenA = new Token(this.chainId, address0, decimals0, symbol0, name0);
    const TokenB = new Token(this.chainId, address1, decimals1, symbol1, name1);

    const pool = new Pool(
      TokenA,
      TokenB,
      fee,
      slot[0].toString(),
      liquidity.toString(),
      slot[1]
    );

    return Number(pool.token0Price.toSignificant(10))
  }

  showPrice = async (price: number) => {
    const rate = await this.exchangeRate()
    return price / rate
  }

  swap = async (price: number) => {
    try {
      const immutables = await getPoolImmutables(this.poolContract)
      const state = await getPoolState(this.poolContract)

      const swapRouterContract = new ethers.Contract(
        this.swapRouterAddress,
        SwapRouterABI,
        this.provider
      )

      const inputAmount = price * 1.01
      const amountIn = ethers.utils.parseUnits(
        inputAmount.toString(),
        decimals0
      )

      const ethRate = await this.showPrice(inputAmount)
      const amountInMaximum = (Math.floor(ethRate * 1.1)).toString() + "000000000000000000"

      const approvalAmount = (amountInMaximum as unknown as number * 100000).toString()
      console.log(amountIn)
      const tokenContract0 = new ethers.Contract(
        address0,
        ERC20ABI,
        this.provider
      )
      const approvalResponse = await tokenContract0.connect(this.web3Provider.getSigner()).approve(
        this.swapRouterAddress,
        amountInMaximum,
      )

      const params = {
        tokenIn: immutables.token0,
        tokenOut: immutables.token1,
        fee: immutables.fee,
        recipient: this.web3Provider.getSigner().getAddress(),
        deadline: Math.floor(Date.now() / 1000) + (60 * 10),
        amountOut: amountIn,
        amountInMaximum: BigNumber.from(amountInMaximum),
        sqrtPriceLimitX96: 0,
      }

      const transaction = await swapRouterContract.connect(this.web3Provider.getSigner()).exactOutputSingle(
        params,
        {
          gasLimit: ethers.utils.hexlify(2000000)
        }
      ).then((transaction: any) => {
        console.log(transaction)
      })
    } catch (e) {
      console.log(e)
      return e
    }
  }
}
