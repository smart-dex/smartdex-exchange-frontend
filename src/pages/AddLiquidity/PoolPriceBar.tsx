import React from 'react'
import styled from 'styled-components'
import { darkColors, lightColors } from 'style/Color'
import { Currency, Percent, Price } from '@sotatek-anhdao/smartdex-sdk'
import { Text } from 'uikit-sotatek'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { ONE_BIPS } from '../../constants'
import { Field } from '../../state/mint/actions'

const StyleText = styled(Text)`
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 14px;
  }
`

const TextPrice = styled(StyleText)`
  position: relative;
  display: inline-block;
  &:hover {
    div {
      visibility: visible;
      opacity: 1;
    }
  }
`

const ToolTipHover = styled.div`
  visibility: hidden;
  background-color: ${({ theme }) => (theme.isDark ? darkColors.buttonView : lightColors.buttonView)};
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
  text-align: center;
  border-radius: 6px;
  padding: 8px 12px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  opacity: 0;
  transition: opacity 0.3s;
  &:after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${({ theme }) => (theme.isDark ? darkColors.buttonView : lightColors.buttonView)} transparent transparent transparent;
  }
`

export function PoolPriceBar({
  currencies,
  noLiquidity,
  poolTokenPercentage,
  price,
}: {
  currencies: { [field in Field]?: Currency }
  noLiquidity?: boolean
  poolTokenPercentage?: Percent
  price?: Price
}) {
  const handlePrice = (priceValue) => {
    const priceString = priceValue?.toSignificant(6).toString()
    let priceNew = priceString
    if (priceString && priceString.length > 10) {
      priceNew = `${priceString.slice(0, 10)}...`
    }

    return priceNew
  }

  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <Text>
            <TextPrice>
              {handlePrice(price) ?? '-'}
              <ToolTipHover>{price?.toSignificant(6)}</ToolTipHover>
            </TextPrice>
          </Text>
          <Text pt={1}>
            <StyleText>
              {currencies[Field.CURRENCY_B]?.symbol} per {currencies[Field.CURRENCY_A]?.symbol}
            </StyleText>
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <Text>
          <TextPrice>
              {handlePrice(price?.invert()) ?? '-'}
              <ToolTipHover>{price?.invert()?.toSignificant(6)}</ToolTipHover>
            </TextPrice>
          </Text>
          <Text pt={1}>
            <StyleText>
              {currencies[Field.CURRENCY_A]?.symbol} per {currencies[Field.CURRENCY_B]?.symbol}
            </StyleText>
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <Text>
            <StyleText>
              {noLiquidity && price
                ? '100'
                : (poolTokenPercentage?.lessThan(ONE_BIPS) ? '<0.01' : poolTokenPercentage?.toFixed(2)) ?? '0'}
              %
            </StyleText>
          </Text>
          <Text fontSize="14px" color="textSubtle" pt={1}>
            <StyleText>Share of Pool</StyleText>
          </Text>
        </AutoColumn>
      </AutoRow>
    </AutoColumn>
  )
}

export default PoolPriceBar
