import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Trade, TradeType } from '@sotatek-anhdao/smartdex-sdk'
import { darkColors, lightColors, baseColors } from 'style/Color'
import { Button, Text } from 'smartdex-uikit'
import { ArrowDown, AlertTriangle } from 'react-feather'
import { TranslateString } from 'utils/translateTextHelpers'
import { Field } from '../../state/swap/actions'
import { isAddress, shortenAddress } from '../../utils'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, warningSeverity } from '../../utils/prices'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import { RowBetween, RowFixed } from '../Row'
import { SwapShowAcceptChanges } from './styleds'

const PriceInfoText = styled(Text)`
  font-style: italic;
  line-height: 1.3;
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
  span {
    color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
    font-weight: 600;
  }
`

const TextStyle = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
`

const ArrowDownStyle = styled(ArrowDown)`
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
`

const ButtonStyle = styled(Button)`
  background: ${ baseColors.primary};
  color: '#fff;
  font-size: 12px;
  padding: 0 12px;
  height: 45px;
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 16px;
    padding: 0 24px;
    height: 56px;
  }
`

export default function SwapModalHeader({
  trade,
  allowedSlippage,
  recipient,
  showAcceptChanges,
  onAcceptChanges,
}: {
  trade: Trade
  allowedSlippage: number
  recipient: string | null
  showAcceptChanges: boolean
  onAcceptChanges: () => void
}) {
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    trade,
    allowedSlippage,
  ])
  const { priceImpactWithoutFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const theme = useContext(ThemeContext)

  return (
    <AutoColumn gap="md" style={{ marginTop: '20px' }}>
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.inputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <TextStyle
            fontSize="24px"
            color={showAcceptChanges && trade.tradeType === TradeType.EXACT_OUTPUT ? theme.colors.primary : 'text'}
            style={{ marginLeft: '10px', fontWeight: 500 }}
          >
            {trade.inputAmount.toSignificant(6)}
          </TextStyle>
        </RowFixed>
        <RowFixed gap="0px">
          <TextStyle fontSize="24px" style={{ marginLeft: '10px', fontWeight: 500 }}>
            {trade.inputAmount.currency.symbol}
          </TextStyle>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDownStyle size="16" style={{ marginLeft: '4px', minWidth: '16px' }} />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={trade.outputAmount.currency} size="24px" style={{ marginRight: '12px' }} />
          <TextStyle
            fontSize="24px"
            style={{ marginLeft: '10px', fontWeight: 500 }}
            color={
              priceImpactSeverity > 2
                ? theme.colors.failure
                : showAcceptChanges && trade.tradeType === TradeType.EXACT_INPUT
                ? theme.colors.primary
                : 'text'
            }
          >
            {trade.outputAmount.toSignificant(6)}
          </TextStyle>
        </RowFixed>
        <RowFixed gap="0px">
          <TextStyle fontSize="24px" style={{ marginLeft: '10px', fontWeight: 500 }}>
            {trade.outputAmount.currency.symbol}
          </TextStyle>
        </RowFixed>
      </RowBetween>
      {showAcceptChanges ? (
        <SwapShowAcceptChanges justify="flex-start" gap="0px">
          <RowBetween>
            <RowFixed>
              <AlertTriangle size={20} style={{ marginRight: '8px', minWidth: 24 }} />
              <TextStyle color="primary"> Price Updated</TextStyle>
            </RowFixed>
            <ButtonStyle onClick={onAcceptChanges}>Accept</ButtonStyle>
          </RowBetween>
        </SwapShowAcceptChanges>
      ) : null}
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '16px 0 0' }}>
        {trade.tradeType === TradeType.EXACT_INPUT ? (
          <PriceInfoText>
            {TranslateString(1214, "Output is estimated. You will receive at least ")}
            <span>
              {slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(6)} {trade.outputAmount.currency.symbol} 
            </span>
            {TranslateString(1215, "or the transaction will revert.")}
          </PriceInfoText>
        ) : (
          <PriceInfoText>
            {TranslateString(1216, "Input is estimated. You will sell at most ")}
            <span>
              {slippageAdjustedAmounts[Field.INPUT]?.toSignificant(6)} {trade.inputAmount.currency.symbol}
            </span>
            {TranslateString(1215, "or the transaction will revert. ")}
          </PriceInfoText>
        )}
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '16px 0 0' }}>
          <TextStyle>
            Output will be sent to{' '}
            <b title={recipient}>{isAddress(recipient) ? shortenAddress(recipient) : recipient}</b>
          </TextStyle>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}
