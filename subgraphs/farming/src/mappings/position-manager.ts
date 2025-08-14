import {
  IncreaseLiquidity,
  DecreaseLiquidity,
  Transfer
} from '../types/NonfungiblePositionManager/NonfungiblePositionManager'
import {  Deposit, PositionTransferCache } from '../types/schema'
import { BigInt} from '@graphprotocol/graph-ts'

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  let entity = Deposit.load(event.params.tokenId.toString());

  if (entity == null) {
    entity = new Deposit(event.params.tokenId.toString());
    let cache = PositionTransferCache.load('1')!
    entity.owner = cache.owner;
    entity.pool = event.params.pool;
    entity.liquidity = BigInt.fromString("0")
  }
  entity.liquidity = entity.liquidity.plus(event.params.actualLiquidity);
  entity.save();

}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void{

  let deposit = Deposit.load(event.params.tokenId.toString());
  if (deposit){
    deposit.liquidity = deposit.liquidity.minus(event.params.liquidity)
    deposit.save()
  }
}


export function handleTransfer(event: Transfer): void {

  let entity = Deposit.load(event.params.tokenId.toString());
  
  if (entity != null) {
    entity.owner = event.params.to;
    entity.save(); 
  } else {
    let transferCache = PositionTransferCache.load('1')
    if(transferCache == null) {
      transferCache = new PositionTransferCache('1')
    }
    transferCache.owner = event.params.to
    transferCache.save()
  }
 
}