import { ethers } from "ethers";
export declare const getPoolImmutables: (poolContract: ethers.Contract) => Promise<{
    token0: any;
    token1: any;
    fee: any;
}>;
export declare const getPoolState: (poolContract: ethers.Contract) => Promise<{
    sqrtPriceX96: any;
}>;
