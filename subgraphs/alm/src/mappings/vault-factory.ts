import { AlgebraVaultCreated } from '../types/AlmVaultFactory/AlmVaultFactory'
import { AlmVault, Token } from '../types/schema'
import { Address } from '@graphprotocol/graph-ts'
import { AlmVault as AlmVaultTemplate } from '../types/templates'
import { AlmVault as AlmVaultContract } from '../types/AlmVaultFactory/AlmVault'
import { ADDRESS_ZERO, ZERO_BD, ZERO_BI } from '../utils/constants'
import { fetchTokenSymbol, fetchTokenName, fetchTokenTotalSupply, fetchTokenDecimals } from '../utils/token'

export function handleVaultCreated(event: AlgebraVaultCreated): void {
    const vaultAddress = event.params.algebraVault
    const vaultContract = AlmVaultContract.bind(vaultAddress)
    const poolAddress = vaultContract.pool()

    const vault = new AlmVault(vaultAddress.toHexString())
    const tokenA = event.params.tokenA
    const tokenB = event.params.tokenB

    let token0 = Token.load(tokenA.toHexString())
    let token1 = Token.load(tokenB.toHexString())
    // fetch info if null
    if (token0 === null) {
        token0 = new Token(tokenA.toHexString())
        token0.symbol = fetchTokenSymbol(tokenA)
        token0.name = fetchTokenName(tokenA)
        token0.totalSupply = fetchTokenTotalSupply(tokenA)
        token0.decimals = fetchTokenDecimals(tokenA)
        token0.save()
    }

    if (token1 === null) {
        token1 = new Token(tokenB.toHexString())
        token1.symbol = fetchTokenSymbol(tokenB)
        token1.name = fetchTokenName(tokenB)
        token1.totalSupply = fetchTokenTotalSupply(tokenB)
        token1.decimals = fetchTokenDecimals(tokenB)
        token1.save()
    }

    vault.token0 = event.params.tokenA
    vault.token1 = event.params.tokenB
    vault.decimals0 = token0.decimals
    vault.decimals1 = token1.decimals
    vault.allowToken0 = event.params.allowTokenA
    vault.allowToken1 = event.params.allowTokenB
    vault.createdAtTimestamp = event.block.timestamp
    vault.holdersCount = 0
    vault.totalAmount0 = ZERO_BI
    vault.totalAmount1 = ZERO_BI
    vault.totalSupply = ZERO_BI
    vault.lastPrice = ZERO_BD
    vault.lastPriceTimestamp = event.block.timestamp
    vault.lastFeeUpdate = event.block.timestamp
    vault.feePerSecond0_1d = ZERO_BI
    vault.feePerSecond0_3d = ZERO_BI
    vault.feePerSecond0_7d = ZERO_BI
    vault.feePerSecond0_30d = ZERO_BI
    vault.feePerSecond1_1d = ZERO_BI
    vault.feePerSecond1_3d = ZERO_BI
    vault.feePerSecond1_7d = ZERO_BI
    vault.feePerSecond1_30d = ZERO_BI
    vault.feeApr_1d = ZERO_BD
    vault.feeApr_3d = ZERO_BD
    vault.feeApr_7d = ZERO_BD
    vault.feeApr_30d = ZERO_BD
    vault.pool = poolAddress
    vault.farmingContract = Address.fromString(ADDRESS_ZERO)
    vault.save()

    AlmVaultTemplate.create(event.params.algebraVault)
}
