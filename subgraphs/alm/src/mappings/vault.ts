import { BigInt, BigDecimal, Address, Bytes } from '@graphprotocol/graph-ts'
import { Transfer, FarmingContract, Withdraw, Rebalance, Deposit, CollectFees, } from '../types/templates/AlmVault/AlmVault'
import { AlmVault, VaultRebalance, VaultCollectFee, VaultDeposit,  VaultWithdraw, VaultShare} from '../types/schema'
import { Pool as PoolContract} from '../types/templates/AlmVault/Pool'
import { BI_18, ADDRESS_ZERO, ZERO_BD , DAY_1, DAY_3, DAY_7, DAY_30, YEAR } from '../utils/constants'
import { priceToTokenPrices,  tokenAmountToDecimal } from '../utils/index'

export function handleDeposit(event: Deposit): void {
    const vault = AlmVault.load(event.address.toHexString())!
    let deposit = VaultDeposit.load(event.transaction.hash.toHexString() + '-' + event.logIndex.toString())

    if (deposit == null) {
        deposit = new VaultDeposit(event.transaction.hash.toHexString() + '-' + event.logIndex.toString())
        deposit.vault = event.address;
        deposit.sender = event.params.sender;
        deposit.to = event.params.to;
        deposit.origin = event.transaction.from;
        deposit.shares = event.params.shares;
        deposit.amount0 = event.params.amount0;
        deposit.amount1 = event.params.amount1;
        deposit.createdAtTimestamp = event.block.timestamp;
        let poolPrices = getPoolPrice(vault.pool)
        deposit.tick = poolPrices[1].toI32();
        deposit.sqrtPrice = poolPrices[0];
        let tokenPrices = priceToTokenPrices(poolPrices[0], vault.decimals0, vault.decimals1)
        deposit.lastPrice = tokenPrices[1]
        deposit.totalAmount0BeforeEvent = vault.totalAmount0;
        deposit.totalAmount1BeforeEvent = vault.totalAmount1;
        deposit.totalSupply = vault.totalSupply;

        vault.lastPrice = tokenPrices[1]
        vault.lastPriceTimestamp = event.block.timestamp
    }

    vault.totalAmount0 = vault.totalAmount0.plus(event.params.amount0)
    vault.totalAmount1 = vault.totalAmount1.plus(event.params.amount1)

    deposit.totalAmount0 = vault.totalAmount0;
    deposit.totalAmount1 = vault.totalAmount1;
    vault.save()
    deposit.save()
}

export function handleRebalance(event: Rebalance): void {
    let vault = AlmVault.load(event.address.toHexString())!
    let rebalance = VaultRebalance.load(event.transaction.hash.toHexString() + '-' + event.logIndex.toString())

    if (rebalance == null) {
        rebalance = new VaultRebalance(event.transaction.hash.toHexString() + '-' + event.logIndex.toString())
        rebalance.vault = event.address;
        rebalance.createdAtTimestamp = event.block.timestamp;
        rebalance.tick = event.params.tick;

        let poolPrices = getPoolPrice(vault.pool)
        rebalance.sqrtPrice = poolPrices[0];
        let tokenPrices = priceToTokenPrices(poolPrices[0], vault.decimals0, vault.decimals1)
        rebalance.lastPrice = tokenPrices[1]

        rebalance.totalAmount0 = event.params.totalAmount0
        rebalance.totalAmount1 = event.params.totalAmount1
        rebalance.feeAmount0 = event.params.feeAmount0
        rebalance.feeAmount1 = event.params.feeAmount1

        rebalance.totalSupply = vault.totalSupply;
        vault.lastPrice = tokenPrices[1]
        vault.lastPriceTimestamp = event.block.timestamp
    }

    vault = updateFeePerSecond(vault, event.params.feeAmount0, event.params.feeAmount1, event.block.timestamp)

    vault.totalAmount0 = event.params.totalAmount0
    vault.totalAmount1 = event.params.totalAmount1
    vault.lastFeeUpdate = event.block.timestamp;

    vault = calculateApr(vault)
    rebalance.save()
    vault.save()
}

export function handleCollectFees(event: CollectFees): void {
    let vault = AlmVault.load(event.address.toHexString())!
    let collect = VaultCollectFee.load(event.transaction.hash.toHexString() + '-' + event.logIndex.toString())

    if (collect == null) {
        collect = new VaultCollectFee(event.transaction.hash.toHexString() + '-' + event.logIndex.toString())
        collect.vault = event.address;
        collect.createdAtTimestamp = event.block.timestamp;
        collect.sender = event.params.sender;

        let poolPrices = getPoolPrice(vault.pool)
        collect.origin = event.transaction.from;
        collect.tick = poolPrices[1].toI32();
        collect.sqrtPrice = poolPrices[0];
        let tokenPrices = priceToTokenPrices(poolPrices[0], vault.decimals0, vault.decimals1)
        collect.lastPrice = tokenPrices[1]

        collect.feeAmount0 = event.params.feeAmount0
        collect.feeAmount1 = event.params.feeAmount1

        collect.totalSupply = vault.totalSupply;
        vault.lastPrice = tokenPrices[1]
        vault.lastPriceTimestamp = event.block.timestamp
    }

    vault = updateFeePerSecond(vault, event.params.feeAmount0, event.params.feeAmount1, event.block.timestamp)
    vault.lastFeeUpdate = event.block.timestamp;
    
    collect.totalAmount0 = vault.totalAmount0;
    collect.totalAmount1 = vault.totalAmount1;

    vault = calculateApr(vault)
    collect.save()
    vault.save()
}

export function handleWithdraw(event: Withdraw): void {
    const vault = AlmVault.load(event.address.toHexString())!
    let withdraw = VaultWithdraw.load(event.transaction.hash.toHexString() + '-' + event.logIndex.toString())

    if (withdraw == null) {
        withdraw = new VaultWithdraw(event.transaction.hash.toHexString() + '-' + event.logIndex.toString())
        withdraw.vault = event.address;
        withdraw.createdAtTimestamp = event.block.timestamp;
        withdraw.sender = event.params.sender;
        withdraw.to = event.params.to;
        withdraw.origin = event.transaction.from;
        withdraw.shares = event.params.shares;
        withdraw.amount0 = event.params.amount0;
        withdraw.amount1 = event.params.amount1;

        let poolPrices = getPoolPrice(vault.pool)
        withdraw.tick = poolPrices[1].toI32();
        withdraw.sqrtPrice = poolPrices[0];
        let tokenPrices = priceToTokenPrices(poolPrices[0], vault.decimals0, vault.decimals1)
        withdraw.lastPrice = tokenPrices[1]

        withdraw.totalAmount0BeforeEvent = vault.totalAmount0;
        withdraw.totalAmount1BeforeEvent = vault.totalAmount1;

        withdraw.totalSupply = vault.totalSupply;
        vault.lastPrice = tokenPrices[1]
        vault.lastPriceTimestamp = event.block.timestamp
    }

    vault.totalAmount0 = vault.totalAmount0.minus(event.params.amount0)
    vault.totalAmount1 = vault.totalAmount1.minus(event.params.amount1)
    
    withdraw.totalAmount0 = vault.totalAmount0;
    withdraw.totalAmount1 = vault.totalAmount1;

    withdraw.save()
    vault.save()
}

export function handleTransfer(event: Transfer): void {
    const vaultAddress = event.address
    const from = event.params.from
    const to = event.params.to
    const value =  tokenAmountToDecimal(event.params.value, BI_18)

    const vault = AlmVault.load(vaultAddress.toHexString())!
    const farmingContract = vault.farmingContract

    // if mint
    if (from.toHexString() == ADDRESS_ZERO) {
        vault.totalSupply = vault.totalSupply.plus(event.params.value)
        vault.save()
    }

    /// if burn
    if (to.toHexString() == ADDRESS_ZERO) {
        vault.totalSupply = vault.totalSupply.minus(event.params.value)
        vault.save()
    }

    /// if stake to farming contract
    if (to == farmingContract) {
        const share = getOrCreateVaultShare(vaultAddress, from)
        share.vaultShareBalance = share.vaultShareBalance.minus(value)
        share.vaultShareStaked = share.vaultShareStaked.plus(value)
        share.save()
    }

    /// if unstake from farming contract
    if (from == farmingContract) {
        const share = getOrCreateVaultShare(vaultAddress, to)
        share.vaultShareBalance = share.vaultShareBalance.plus(value)
        share.vaultShareStaked = share.vaultShareStaked.minus(value)
        share.save()
    }

    if (from.toHexString() != ADDRESS_ZERO && from != vaultAddress && from != farmingContract && to != farmingContract) {
        const share = getOrCreateVaultShare(vaultAddress, from)
        share.vaultShareBalance = share.vaultShareBalance.minus(value)
        share.save()
    }

    if (to.toHexString() != ADDRESS_ZERO && to != vaultAddress && from != farmingContract && to != farmingContract) {
        const share = getOrCreateVaultShare(vaultAddress, to)
        share.vaultShareBalance = share.vaultShareBalance.plus(value)
        share.save()
    }

}

export function handleFarmingContract(event: FarmingContract): void {
    let vault = AlmVault.load(event.address.toHexString())!
    vault.farmingContract = event.params.farmingContract
    vault.save()
}


export function getOrCreateVaultShare(vault: Address, user: Address): VaultShare {
    let id = vault
        .toHexString()
        .concat('-')
        .concat(user.toHexString())
    let share = VaultShare.load(id)
    if (!share) {
        share = new VaultShare(id)
        share.vault = vault.toHexString()
        share.user = user
        share.vaultShareBalance = ZERO_BD
        share.vaultShareStaked = ZERO_BD
        share.save()
    }
    return share
}

export function getPoolPrice(poolAddress: Bytes): BigInt[] {
    const poolContract = PoolContract.bind(Address.fromBytes(poolAddress))
    const state = poolContract.globalState()
    return [state.value0, BigInt.fromI32(state.value1)] 
}

function updateFeePerSecond(vault: AlmVault, feeAmount0: BigInt, feeAmount1: BigInt, curentTime: BigInt): AlmVault {
    const timeDelta = curentTime.minus(vault.lastFeeUpdate)
    vault.feePerSecond0_1d = timeDelta > DAY_1 ? (feeAmount0 / DAY_1) : ((vault.feePerSecond0_1d * (DAY_1 - timeDelta) + feeAmount0) / DAY_1)
    vault.feePerSecond0_3d = timeDelta > DAY_3 ? (feeAmount0 / DAY_3) : ((vault.feePerSecond0_3d * (DAY_3 - timeDelta) + feeAmount0) / DAY_3)
    vault.feePerSecond0_7d = timeDelta > DAY_7 ? (feeAmount0 / DAY_7) : ((vault.feePerSecond0_7d * (DAY_7 - timeDelta) + feeAmount0) / DAY_7)
    vault.feePerSecond0_30d = timeDelta > DAY_30 ? (feeAmount0 / DAY_30) : ((vault.feePerSecond0_30d * (DAY_30 - timeDelta) + feeAmount0) / DAY_30)
    vault.feePerSecond1_1d = timeDelta > DAY_1 ? feeAmount1 / DAY_1 : (vault.feePerSecond1_1d * (DAY_1 - timeDelta) + feeAmount1) / DAY_1
    vault.feePerSecond1_3d = timeDelta > DAY_3 ? feeAmount1 / DAY_3 : (vault.feePerSecond1_3d * (DAY_3 - timeDelta) + feeAmount1) / DAY_3
    vault.feePerSecond1_7d = timeDelta > DAY_7 ? feeAmount1 / DAY_7 : (vault.feePerSecond1_7d * (DAY_7 - timeDelta) + feeAmount1) / DAY_7
    vault.feePerSecond1_30d = timeDelta > DAY_30 ? feeAmount1 / DAY_30 : (vault.feePerSecond1_30d * (DAY_30 - timeDelta) + feeAmount1) / DAY_30
    return vault
}

function calculateApr(vault: AlmVault): AlmVault {
    let decimals0 = vault.decimals0
    let decimals1 = vault.decimals1
    let lastPrice = vault.lastPrice
    let tvl =  tokenAmountToDecimal(vault.totalAmount1, decimals1)  + tokenAmountToDecimal(vault.totalAmount0, decimals0) * lastPrice
    vault.feeApr_1d = ((tokenAmountToDecimal(vault.feePerSecond0_1d, decimals0) * lastPrice + tokenAmountToDecimal(vault.feePerSecond1_1d, decimals1)) * BigDecimal.fromString("100") * YEAR) / tvl
    vault.feeApr_3d = ((tokenAmountToDecimal(vault.feePerSecond0_3d, decimals0) * lastPrice + tokenAmountToDecimal(vault.feePerSecond1_3d, decimals1)) * BigDecimal.fromString("100") * YEAR) / tvl
    vault.feeApr_7d = ((tokenAmountToDecimal(vault.feePerSecond0_7d, decimals0) * lastPrice + tokenAmountToDecimal(vault.feePerSecond1_7d, decimals1)) * BigDecimal.fromString("100") * YEAR) / tvl
    vault.feeApr_30d = ((tokenAmountToDecimal(vault.feePerSecond0_30d, decimals0) * lastPrice + tokenAmountToDecimal(vault.feePerSecond1_30d, decimals1)) * BigDecimal.fromString("100") * YEAR) / tvl
    return vault
}
