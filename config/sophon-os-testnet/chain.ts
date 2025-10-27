/* eslint-disable prefer-const */
import { BigDecimal} from '@graphprotocol/graph-ts'

// Addresses for analytics subgraph 
export const FACTORY_ADDRESS = '0x10253594A832f967994b44f33411940533302ACb'
export const NONFUNGIBLE_POSITION_MANAGER_ADDRESS = '0x69D57B9D705eaD73a5d2f2476C30c55bD755cc2F'

export const REFERENCE_TOKEN = '0x577bdFf849E65C1eFfeb8114e9cd243C1180F158' // Wrapped Native Token
export const STABLE_TOKEN_POOL = '0xF80b49461959e193100EaF052F1435A01D3eF4EC' // WSOPH/USDC pool (fake, to change later)

// Minimum reference token locked in pool for pricing calculations
export const MINIMUM_NATIVE_LOCKED = BigDecimal.fromString('0')

// Token lists for tracking volume and liquidity
export const WHITELIST_TOKENS: string[] = [
  '0x577bdFf849E65C1eFfeb8114e9cd243C1180F158', // WSOPH
  '0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb' // USDT (fake, to change later)
]

// Stable coins for USD pricing (tokens with stable $1 value)
export const STABLE_COINS: string[] = [
  '0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb' // USDT (fake, to change later)
]

// Addresses for farming subgraph
// Farming contracts
export const ETERNAL_FARMING_ADDRESS = '0x50FCbF85d23aF7C91f94842FeCd83d16665d27bA'  

// Addresses for limit order subgraph
// Limit order contract
export const LIMIT_ORDER_ADDRESS = '0x822ddb9EECc3794790B8316585FebA5b8F7C7507'
