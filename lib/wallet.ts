// Wagmi + Viem wallet integration (stub)
import { createConfig, configureChains, mainnet, sepolia } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { createPublicClient, http } from 'viem';

const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()]
);

export const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient: createPublicClient({ chain: mainnet, transport: http() })
});
