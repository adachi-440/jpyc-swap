# README

## jpyc-swap

`jpyc-swap` is a library to swap jpyc and other crypto assets more easily using uniswap v3 sdk.

## **Installation**

---

with npm:

`npm --save @t_adachi/jpyc-swap`

with yarn:

`yarn add @t_adachi/jpyc-swap`

## Usage

---

```tsx
import { JPYCSwap } from '@t_adachi/jpyc-swap'

const App = () => {
	const swap = async () => {
		// provider is web3Provider.
		// The second argument is assigned the chain ID
		const jpycSwap = new JPYCSwap(provider, 4)

		// Returns the price converted to JPYC
		const jpycPrice = await jpycSwap.showPrice(price)

		// Swap JPYC to another currency
		await jpycSwap.swap(0.001)
	}

	return (
		<button onClick={() => swap())}>
        Swap
    </button>
	)
}
```

## Other

---

The library currently supports ethereum mainnet and testnet.
Also, as for coins, it currently only supports JPYC and ETH.
More chains and coins will be added in the future.

## License

---

MIT
