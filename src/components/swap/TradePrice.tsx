import React from 'react'
import { Price } from '@sotatek-anhdao/smartdex-sdk'
import styled from 'styled-components'
import { SyncAltIcon, Text } from 'smartdex-uikit'
import { baseColors, darkColors, lightColors} from 'style/Color'
import { TranslateString } from 'utils/translateTextHelpers'
import { StyledBalanceMaxMini } from './styleds'

const IconStyle = styled.div`
svg {
  fill: ${ baseColors.primary};
}
`

const TextStyle = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
  justify-content: center;
  align-items: center;
  display: flex;
`
interface TradePriceProps {
  price?: Price
  showInverted: boolean
  setShowInverted: (showInverted: boolean) => void
}

export default function TradePrice({ price, showInverted, setShowInverted }: TradePriceProps) {
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6)

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency)
  const label = showInverted
    ? `${price?.quoteCurrency?.symbol} ${TranslateString(242, "per")} ${price?.baseCurrency?.symbol}`
    : `${price?.baseCurrency?.symbol} ${TranslateString(242, "per")} ${price?.quoteCurrency?.symbol}`

  return (
    <TextStyle fontSize="14px">
      {show ? (
        <>
          {formattedPrice ?? '-'} {label}
          <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
            <IconStyle>
            <SyncAltIcon width="20px" />
            </IconStyle>

          </StyledBalanceMaxMini>
        </>
      ) : (
        '-'
      )}
    </TextStyle>
  )
}
