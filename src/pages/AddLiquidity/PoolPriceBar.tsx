import React from 'react'
import styled from 'styled-components'
import { darkColors, lightColors } from 'style/Color'
import { Currency, Percent, Price } from '@pancakeswap-libs/sdk'
import { Text } from 'uikit-sotatek'
import { AutoColumn } from '../../components/Column'
import { AutoRow } from '../../components/Row'
import { ONE_BIPS } from '../../constants'
import { Field } from '../../state/mint/actions'

const StyleText = styled(Text)`
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;
  color: ${({theme}) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 14px;
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
  return (
    <AutoColumn gap="md">
      <AutoRow justify="space-around" gap="4px">
        <AutoColumn justify="center">
          <Text><StyleText>{price?.toSignificant(6) ?? '-'}</StyleText></Text>
          <Text pt={1}>
            <StyleText>{currencies[Field.CURRENCY_B]?.symbol} per {currencies[Field.CURRENCY_A]?.symbol}</StyleText>
          </Text>
        </AutoColumn>
        <AutoColumn justify="center">
          <Text><StyleText>{price?.invert()?.toSignificant(6) ?? '-'}</StyleText></Text>
          <Text pt={1}>
            <StyleText>{currencies[Field.CURRENCY_A]?.symbol} per {currencies[Field.CURRENCY_B]?.symbol}</StyleText>
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
