import { ethers } from 'ethers';
export declare class JPYCSwap {
    poolAddress: string;
    poolContract: ethers.Contract;
    web3Provider: ethers.providers.Web3Provider;
    chainId: number;
    provider: ethers.providers.Provider;
    swapRouterAddress: string;
    constructor(web3Provider: ethers.providers.Web3Provider, chainId: number);
    exchangeRate: () => Promise<number>;
    showPrice: (price: number) => Promise<number>;
    swap: (price: number) => Promise<void>;
}
