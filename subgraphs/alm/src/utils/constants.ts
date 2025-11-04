/* eslint-disable prefer-const */
import { BigInt, BigDecimal} from '@graphprotocol/graph-ts'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)
export let Q192 = BigInt.fromI32(2).pow(192)

export let DAY_1 = BigInt.fromI32(86400)
export let DAY_3 = BigInt.fromI32(86400 * 3)
export let DAY_7 = BigInt.fromI32(86400 * 7)
export let DAY_30 = BigInt.fromI32(86400 * 30)
export let YEAR = BigDecimal.fromString("31536000")