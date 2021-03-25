import { Currency, CurrencyAmount, Fraction, Percent } from '@sotatek-anhdao/cake-sdk'
import React from 'react'
import { darkColors, lightColors, baseColors} from 'style/Color'
import styled from 'styled-components'
import { Button, Text } from 'uikit-sotatek'
import { RowBetween, RowFixed } from '../../components/Row'
import CurrencyLogo from '../../components/CurrencyLogo'
import { Field } from '../../state/mint/actions'


const TextStyle = styled(Text)`
font-size: 10px;
line-height: 20px;
padding: 0;
font-weight: 500;
color: ${({ theme }) => (theme.isDark ? darkColors.textSubtle : lightColors.textMenuLeft)};
${({ theme }) => theme.mediaQueries.nav} {
  font-size: 14px;
  line-height: 24px;
  padding: 0.2rem 0;
}
`

const ButtonStyle = styled(Button)`
  background: ${ baseColors.primary};
`

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  return (
    <>
      <RowBetween>
        <TextStyle>{currencies[Field.CURRENCY_A]?.symbol} Deposited</TextStyle>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
          <TextStyle>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</TextStyle>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TextStyle>{currencies[Field.CURRENCY_B]?.symbol} Deposited</TextStyle>
        <RowFixed>
          <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
          <TextStyle>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</TextStyle>
        </RowFixed>
      </RowBetween>
      <RowBetween>
        <TextStyle>Rates</TextStyle>
        <TextStyle>
          {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
            currencies[Field.CURRENCY_B]?.symbol
          }`}
        </TextStyle>
      </RowBetween>
      <RowBetween style={{ justifyContent: 'flex-end' }}>
        <TextStyle>
          {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
            currencies[Field.CURRENCY_A]?.symbol
          }`}
        </TextStyle>
      </RowBetween>
      <RowBetween>
        <TextStyle>Share of Pool:</TextStyle>
        <TextStyle>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</TextStyle>
      </RowBetween>
      <ButtonStyle mt="20px" onClick={onAdd}>
        {noLiquidity ? 'Create Pool & Supply' : 'Confirm Supply'}
      </ButtonStyle>
    </>
  )
}

export default ConfirmAddModalBottom
