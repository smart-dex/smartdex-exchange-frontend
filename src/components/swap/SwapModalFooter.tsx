import { Trade, TradeType } from '@sotatek-anhdao/smartdex-sdk'
import React, { useMemo, useState } from 'react'
import { darkColors, lightColors, baseColors } from 'style/Color'
import styled from 'styled-components'
import { Text , Button } from 'uikit-sotatek'
import { Repeat } from 'react-feather'

import { TranslateString } from 'utils/translateTextHelpers'
import { Field } from '../../state/swap/actions'
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
  formatExecutionPrice,
  warningSeverity
} from '../../utils/prices'
import { AutoColumn } from '../Column'
import QuestionHelper from '../QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from '../Row'
import FormattedPriceImpact from './FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'

const TextStyle = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
`

const handleBgDarkMode = (theme)=>(
  theme.isDark ? darkColors.buttonView : lightColors.buttonView
)

const handleColorDarkMode = (theme)=>(
  theme.isDark ? darkColors.fontPlaceholder : '#8F8FA0'
)

const handleBgSWap = (severity) => (
  severity > 2 ? baseColors.failure : baseColors.primary
)

const ButtonStyle = styled(Button)`
  font-size: 12px;
  padding: 0 12px;
  height: 45px;
  background: ${({disabled, theme, severity }) => disabled ? handleBgDarkMode(theme) : handleBgSWap(severity)} !important;
  color: ${({disabled, theme }) => disabled ? handleColorDarkMode(theme) : lightColors.invertedContrast} !important;
  box-shadow: none;
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 16px;
    padding: 0 24px;
    height: 56px;
  }
`

const RepeatStyle = styled(Repeat)`
color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
`

export default function SwapModalFooter({
  trade,
  onConfirm,
  allowedSlippage,
  swapErrorMessage,
  disabledConfirm
}: {
  trade: Trade
  allowedSlippage: number
  onConfirm: () => void
  swapErrorMessage: string | undefined
  disabledConfirm: boolean
}) {
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const slippageAdjustedAmounts = useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [
    allowedSlippage,
    trade
  ])
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <TextStyle fontSize="14px">{TranslateString(1182, "Price")}</TextStyle>
          <TextStyle
            fontSize="14px"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '8px',
              fontWeight: 500
            }}
          >
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <RepeatStyle size={14} />
            </StyledBalanceMaxMini>
          </TextStyle>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TextStyle fontSize="14px">
              {trade.tradeType === TradeType.EXACT_INPUT ? TranslateString(1210, "Minimum received") : TranslateString(220, "Maximum sold")}
            </TextStyle>
            <QuestionHelper text={TranslateString(202, "Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.")} />
          </RowFixed>
          <RowFixed>
            <TextStyle fontSize="14px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </TextStyle>
            <TextStyle fontSize="14px" marginLeft="4px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </TextStyle>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TextStyle fontSize="14px">{TranslateString(226, "Price Impact")}</TextStyle>
            <QuestionHelper text={TranslateString(224, "The difference between the market price and estimated price due to trade size.")} />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TextStyle fontSize="14px">{TranslateString(228, "Liquidity Provider Fee")}</TextStyle>
            <QuestionHelper text={TranslateString(230, "For each trade a 0.2% fee is paid. 0.17% goes to liquidity providers and 0.03% goes to the SmartDEX treasury.")}/>
          </RowFixed>
          <TextStyle fontSize="14px">
            {realizedLPFee ? `${realizedLPFee?.toSignificant(6)  } ${  trade.inputAmount.currency.symbol}` : '-'}
          </TextStyle>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonStyle
          onClick={onConfirm}
          disabled={disabledConfirm}
          variant={severity > 2 ? 'danger' : 'primary'}
          severity={severity}
          style={{  width: '100%'}}
          mt="10px"
          id="confirm-swap-or-send"
        >
          {severity > 2 ? `${TranslateString(1142, "Swap")} ${TranslateString(1201, "Anyway")} ` : TranslateString(1213, "Confirm Swap")}
        </ButtonStyle>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
