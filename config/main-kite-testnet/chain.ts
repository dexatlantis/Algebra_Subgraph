/* eslint-disable prefer-const */
import { BigDecimal} from '@graphprotocol/graph-ts'

// Addresses for analytics subgraph 
export const FACTORY_ADDRESS = '0x49a390a3dFd2d01389f799965F3af5961f87d228'
export const NONFUNGIBLE_POSITION_MANAGER_ADDRESS = '0x4Eb881885FE22D895Ff299f6cdA6e0A8E00E66A0'

export const REFERENCE_TOKEN = '0x3bC8f037691Ce1d28c0bB224BD33563b49F99dE8' // Wrapped Native Token
export const STABLE_TOKEN_POOL = '0xDb6aEEe363F828ED47030f132a282Fc5aaEaAC17' // USDC/WETH pool

// Minimum reference token locked in pool for pricing calculations
export const MINIMUM_NATIVE_LOCKED = BigDecimal.fromString('0')

// Token lists for tracking volume and liquidity
export const WHITELIST_TOKENS: string[] = [
  '0x2746B1a7B780f128F0db99d9fc60C2DB3E4a7bd5',
  '0xd98F5A16DE519866980f2e3389967Ea01Dc3822d', 
  '0x3bC8f037691Ce1d28c0bB224BD33563b49F99dE8',
  '0x49A390A3DFD2D01389F799965F3AF5961F87D228' 
]

// Stable coins for USD pricing (tokens with stable $1 value)
export const STABLE_COINS: string[] = [
  '0xd98F5A16DE519866980f2e3389967Ea01Dc3822d'
]

// Addresses for farming subgraph
// Farming contracts
export const ETERNAL_FARMING_ADDRESS = '0x45362763166CfED6174d312Fa1449EA1FC37988a'  

// Addresses for limit order subgraph
// Limit order contract
export const LIMIT_ORDER_ADDRESS = '0x05F9E353559da6f2Bfe9A0980D5C3e84eA5d4238' // TODO: update
