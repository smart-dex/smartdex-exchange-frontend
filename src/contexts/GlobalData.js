import React, { createContext, useContext, useReducer, useMemo, useCallback, useEffect } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { client } from '../apollo/client'

import {
  getPercentChange,
  getBlockFromTimestamp,
  getBlocksFromTimestamps,
  get2DayPercentChange,
} from '../utils'
import {
  GLOBAL_DATA,
  ETH_PRICE,
  TOKEN
} from '../apollo/queries'

import {SDC} from '../constants'

const UPDATE = 'UPDATE'
const UPDATE_ETH_PRICE = 'UPDATE_ETH_PRICE'
const ETH_PRICE_KEY = 'ETH_PRICE_KEY'

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)

const GlobalDataContext = createContext()

function useGlobalDataContext() {
  return useContext(GlobalDataContext)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case UPDATE: {
      const { data } = payload
      return {
        ...state,
        globalData: data,
      }
    }
    case UPDATE_ETH_PRICE: {
      const { ethPrice, oneDayPrice, ethPriceChange } = payload
      return {
        [ETH_PRICE_KEY]: ethPrice,
        oneDayPrice,
        ethPriceChange,
      }
    }
    default: {
      throw Error(`Unexpected action type in DataContext reducer: '${type}'.`)
    }
  }
}

export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, {})
  const update = useCallback((data) => {
    dispatch({
      type: UPDATE,
      payload: {
        data,
      },
    })
  }, [])

  const updateEthPrice = useCallback((ethPrice, oneDayPrice, ethPriceChange) => {
    dispatch({
      type: UPDATE_ETH_PRICE,
      payload: {
        ethPrice,
        oneDayPrice,
        ethPriceChange,
      },
    })
  }, [])

  return (
    <GlobalDataContext.Provider
      value={useMemo(
        () => [
          state,
          {
            update,
            updateEthPrice
          },
        ],
        [
          state,
          update,
          updateEthPrice,
        ]
      )}
    >
      {children}
    </GlobalDataContext.Provider>
  )
}

const getSDCToken = async () => {
  let sdcToken = {}
  try {
    const sdc = await client.query({
      query: TOKEN,
      variables: {
        id: SDC,
      },
      fetchPolicy: 'cache-first',
    })
    sdcToken =  sdc.data?.token
  } catch (e) {
    console.log(e)
  }
  return sdcToken
}

/**
 * Gets all the global data for the overview page.
 * Needs current eth price and the old eth price to get
 * 24 hour USD changes.
 * @param {*} ethPrice
 * @param {*} oldEthPrice
 */
async function getGlobalData(ethPrice, oldEthPrice) {
  // data for each day , historic data used for % changes
  let data = {}
  let oneDayData = {}
  let twoDayData = {}

  try {
    // get timestamps for the days
    const utcCurrentTime = dayjs()
    const utcOneDayBack = utcCurrentTime.subtract(1, 'day').unix()
    const utcTwoDaysBack = utcCurrentTime.subtract(2, 'day').unix()
    const utcOneWeekBack = utcCurrentTime.subtract(1, 'week').unix()
    const utcTwoWeeksBack = utcCurrentTime.subtract(2, 'week').unix()
    const sdcToken = await getSDCToken();
    const sdcPrice = sdcToken?.derivedETH * ethPrice

    // get the blocks needed for time travel queries
    const [oneDayBlock, twoDayBlock, oneWeekBlock, twoWeekBlock] = await getBlocksFromTimestamps([
      utcOneDayBack,
      utcTwoDaysBack,
      utcOneWeekBack,
      utcTwoWeeksBack,
    ])

    // fetch the global data
    const result = await client.query({
      query: GLOBAL_DATA(),
      fetchPolicy: 'cache-first',
    })
    data = result.data.uniswapFactories[0]
    if (data) {
      data.sdcPriceUsd = sdcPrice
    }
    console.log("888888888888888", data)
    // fetch the historical data
    const oneDayResult = await client.query({
      query: GLOBAL_DATA(oneDayBlock?.number),
      fetchPolicy: 'cache-first',
    })
    oneDayData = oneDayResult.data.uniswapFactories[0]

    const twoDayResult = await client.query({
      query: GLOBAL_DATA(twoDayBlock?.number),
      fetchPolicy: 'cache-first',
    })
    twoDayData = twoDayResult.data.uniswapFactories[0]

    const oneWeekResult = await client.query({
      query: GLOBAL_DATA(oneWeekBlock?.number),
      fetchPolicy: 'cache-first',
    })
    const oneWeekData = oneWeekResult.data.uniswapFactories[0]

    const twoWeekResult = await client.query({
      query: GLOBAL_DATA(twoWeekBlock?.number),
      fetchPolicy: 'cache-first',
    })
    const twoWeekData = twoWeekResult.data.uniswapFactories[0]

    if (data && oneDayData && twoDayData && twoWeekData) {
      const [oneDayVolumeUSD, volumeChangeUSD] = get2DayPercentChange(
        data.totalVolumeUSD,
        oneDayData.totalVolumeUSD ? oneDayData.totalVolumeUSD : 0,
        twoDayData.totalVolumeUSD ? twoDayData.totalVolumeUSD : 0
      )

      const [oneWeekVolume, weeklyVolumeChange] = get2DayPercentChange(
        data.totalVolumeUSD,
        oneWeekData.totalVolumeUSD,
        twoWeekData.totalVolumeUSD
      )

      const [oneDayTxns, txnChange] = get2DayPercentChange(
        data.txCount,
        oneDayData.txCount ? oneDayData.txCount : 0,
        twoDayData.txCount ? twoDayData.txCount : 0
      )

      // format the total liquidity in USD
      data.totalLiquidityUSD = data.totalLiquidityETH * ethPrice
      const liquidityChangeUSD = getPercentChange(
        data.totalLiquidityETH * ethPrice,
        oneDayData.totalLiquidityETH * oldEthPrice
      )

      // add relevant fields with the calculated amounts
      data.oneDayVolumeUSD = oneDayVolumeUSD
      data.oneWeekVolume = oneWeekVolume
      data.weeklyVolumeChange = weeklyVolumeChange
      data.volumeChangeUSD = volumeChangeUSD
      data.liquidityChangeUSD = liquidityChangeUSD
      data.oneDayTxns = oneDayTxns
      data.txnChange = txnChange
    }
  } catch (e) {
    console.log(e)
  }

  return data
}

/**
 * Gets the current price  of ETH, 24 hour price, and % change between them
 */
const getEthPrice = async () => {
  const utcCurrentTime = dayjs()
  const utcOneDayBack = utcCurrentTime.subtract(1, 'day').startOf('minute').unix()

  let ethPrice = 0
  let ethPriceOneDay = 0
  let priceChangeETH = 0

  try {
    const oneDayBlock = await getBlockFromTimestamp(utcOneDayBack)
    const result = await client.query({
      query: ETH_PRICE(),
      fetchPolicy: 'cache-first',
    })
    const resultOneDay = await client.query({
      query: ETH_PRICE(oneDayBlock),
      fetchPolicy: 'cache-first',
    })
    const currentPrice = result?.data?.bundles[0]?.ethPrice
    const oneDayBackPrice = resultOneDay?.data?.bundles[0]?.ethPrice
    priceChangeETH = getPercentChange(currentPrice, oneDayBackPrice)
    ethPrice = currentPrice
    ethPriceOneDay = oneDayBackPrice
  } catch (e) {
    console.log(e)
  }

  return [ethPrice, ethPriceOneDay, priceChangeETH]
}
export function useEthPrice() {
  const [state, { updateEthPrice }] = useGlobalDataContext()
  const ethPrice = state?.[ETH_PRICE_KEY]
  const ethPriceOld = state?.oneDayPrice
  useEffect(() => {
    async function checkForEthPrice() {
      if (!ethPrice) {
        const [newPrice, oneDayPrice, priceChange] = await getEthPrice()
        updateEthPrice(newPrice, oneDayPrice, priceChange)
      }
    }
    checkForEthPrice()
  }, [ethPrice, updateEthPrice])

  return [ethPrice, ethPriceOld]
}

/**
 * Hook that fetches overview data, plus all tokens and pairs for search
 */
export function useGlobalData() {
  const [state, { update }] = useGlobalDataContext()
  const [ethPrice, oldEthPrice] = useEthPrice()
  const data = state?.globalData
  useEffect(() => {
    async function fetchData() {
      const globalData = await getGlobalData(ethPrice, oldEthPrice)
      update(globalData)
    }
    if (!data && ethPrice && oldEthPrice) {
      fetchData()
    }
  }, [ethPrice, oldEthPrice, update, data])

  return data ||  { totalLiquidityUSD: 0}
}


