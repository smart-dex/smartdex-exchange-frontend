import React from 'react'
import { Trade, TradeType } from '@sotatek-anhdao/smartdex-sdk'
import { darkColors, lightColors} from 'style/Color'
import styled from 'styled-components'
import { CardBody, Text } from 'smartdex-uikit'
import { TranslateString } from 'utils/translateTextHelpers'
import { Field } from '../../state/swap/actions'
import { useUserSlippageTolerance } from '../../state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { SectionBreak } from './styleds'
import SwapRoute from './SwapRoute'


const TextStyle = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
`

const CardStyle = styled(CardBody)`
  box-shadow: none;
  padding: 0px;
`

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage)

  return (
    <CardStyle>
      <CardBody style={{ padding: '4px' }}>
        <RowBetween>
          <RowFixed>
            <TextStyle fontSize="14px">{isExactIn ? TranslateString(1210, "Minimum received") : TranslateString(220, "Maximum sold")}</TextStyle>
            <QuestionHelper text={TranslateString(202, "Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.")}/>
          </RowFixed>
          <RowFixed>
            <TextStyle fontSize="14px">
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                  '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ??
                  '-'}
            </TextStyle>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TextStyle fontSize="14px">{TranslateString(226, "Price Impact")}</TextStyle>
            <QuestionHelper text= {TranslateString(224, "The difference between the market price and estimated price due to trade size.")} />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TextStyle fontSize="14px">{TranslateString(228, "Liquidity Provider Fee")}</TextStyle>
            <QuestionHelper text={TranslateString(230, "For each trade a 0.2% fee is paid. 0.17% goes to liquidity providers and 0.03% goes to the SmartDEX treasury.")} />
          </RowFixed>
          <TextStyle fontSize="14px">
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
          </TextStyle>
        </RowBetween>
      </CardBody>
    </CardStyle>
  )
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(trade && trade.route.path.length > 2)

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: '0px' }}>
                <RowFixed>
                  <TextStyle fontSize="14px">{TranslateString(232, "Route")}</TextStyle>
                  <QuestionHelper text={TranslateString(234, "Routing through these tokens resulted in the best price for your trade.")}/>
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
