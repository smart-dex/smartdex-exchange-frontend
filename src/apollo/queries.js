import gql from 'graphql-tag'
import { FACTORY_ADDRESS, BUNDLE_ID } from '../constants'


export const GET_BLOCK = gql`
    query blocks($timestampFrom: Int!, $timestampTo: Int!) {
        blocks(
            first: 1
            orderBy: timestamp
            orderDirection: asc
            where: { timestamp_gt: $timestampFrom, timestamp_lt: $timestampTo }
        ) {
            id
            number
            timestamp
        }
    }
`

export const GET_BLOCKS = (timestamps) => {
  let queryString = 'query blocks {'
  queryString += timestamps.map((timestamp) => {
    return `t${timestamp}:blocks(first: 1, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${timestamp - 86400}, timestamp_lt: ${
      timestamp
    } }) {
      number
    }`
  })
  queryString += '}'
  return gql(queryString)
}

export const ETH_PRICE = (block) => {
  const queryString = block
    ? `
    query bundles {
      bundles(where: { id: ${BUNDLE_ID} } block: {number: ${block}}) {
        id
        ethPrice
      }
    }
  `
    : ` query bundles {
      bundles(where: { id: ${BUNDLE_ID} }) {
        id
        ethPrice
      }
    }
  `
  return gql(queryString)
}

export const USER = (block, account) => {
  const queryString = `
    query users {
      user(id: "${account}", block: {number: ${block}}) {
        liquidityPositions
      }
    }
`
  return gql(queryString)
}

export const GLOBAL_DATA = (block) => {
  const queryString = ` query uniswapFactories {
      uniswapFactories(
       ${block ? `block: { number: ${block}}` : ``}
       where: { id: "${FACTORY_ADDRESS}" }) {
        id
        totalVolumeUSD
        totalVolumeETH
        untrackedVolumeUSD
        totalLiquidityUSD
        totalLiquidityETH
        txCount
        pairCount
      }
    }`
  return gql(queryString)
}

export const ALL_TOKENS = gql`
    query tokens($skip: Int!) {
        tokens(first: 100, skip: $skip) {
            id
            name
            symbol
            totalLiquidity
        }
    }
`
export const TOKEN = gql`
    query token($id: ID!) {
        token(id: $id) {
            id
            name
            symbol
            derivedETH
            tradeVolume
            tradeVolumeUSD
            untrackedVolumeUSD
            totalLiquidity
            txCount
        }
    }
`

export const ALL_PAIRS = gql`
    query pairs($skip: Int!) {
        pairs(first: 100, skip: $skip, orderBy: trackedReserveETH, orderDirection: desc) {
            id
            token0 {
                id
                symbol
                name
            }
            token1 {
                id
                symbol
                name
            }
        }
    }
`

export const FILTERED_TRANSACTIONS = gql`
    query($allPairs: [Bytes]!) {
        mints(first: 20, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
            transaction {
                id
                timestamp
            }
            pair {
                token0 {
                    id
                    symbol
                }
                token1 {
                    id
                    symbol
                }
            }
            to
            liquidity
            amount0
            amount1
            amountUSD
        }
        burns(first: 20, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
            transaction {
                id
                timestamp
            }
            pair {
                token0 {
                    id
                    symbol
                }
                token1 {
                    id
                    symbol
                }
            }
            sender
            liquidity
            amount0
            amount1
            amountUSD
        }
        swaps(first: 30, where: { pair_in: $allPairs }, orderBy: timestamp, orderDirection: desc) {
            transaction {
                id
                timestamp
            }
            id
            pair {
                token0 {
                    id
                    symbol
                }
                token1 {
                    id
                    symbol
                }
            }
            amount0In
            amount0Out
            amount1In
            amount1Out
            amountUSD
            to
        }
    }
`
