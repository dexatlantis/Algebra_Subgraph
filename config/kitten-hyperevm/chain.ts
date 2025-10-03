/* eslint-disable prefer-const */
import { BigDecimal} from '@graphprotocol/graph-ts'

// Addresses for analytics subgraph 
export const FACTORY_ADDRESS = '0x5f95E92c338e6453111Fc55ee66D4AafccE661A7'
export const NONFUNGIBLE_POSITION_MANAGER_ADDRESS = '0x9ea4459c8DefBF561495d95414b9CF1E2242a3E2'

export const REFERENCE_TOKEN = '0x5555555555555555555555555555555555555555' // Wrapped Native Token
export const STABLE_TOKEN_POOL = '0x3c1403335d0ca7d0A73c9E775B25514537C2b809' // USDC/WETH pool

// Minimum reference token locked in pool for pricing calculations
export const MINIMUM_NATIVE_LOCKED = BigDecimal.fromString('10')

// Token lists for tracking volume and liquidity
export const WHITELIST_TOKENS: string[] = [
  '0x5555555555555555555555555555555555555555', // WHYPE
  '0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb', // USDT
  '0xb88339CB7199b77E23DB6E890353E22632Ba630f', // USDC
  '0xfD739d4e423301CE9385c1fb8850539D657C296D', // kHYPE
  '0x618275F8EFE54c2afa87bfB9F210A52F0fF89364', // KITTEN
  '0xBE65F0F410A72BeC163dC65d46c83699e957D588'  // USDp
]

// Stable coins for USD pricing (tokens with stable $1 value)
export const STABLE_COINS: string[] = [
  '0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb', // USDT
  '0xb88339CB7199b77E23DB6E890353E22632Ba630f', // USDC
  '0xBE65F0F410A72BeC163dC65d46c83699e957D588'  // USDp
]

// Addresses for farming subgraph
// Farming contracts
export const ETERNAL_FARMING_ADDRESS = '0xf3b57fE4d5D0927C3A5e549CB6aF1866687e2D62'  

// Addresses for limit order subgraph
// Limit order contract
export const LIMIT_ORDER_ADDRESS = '0x0000000000000000000000000000000000000000'
