import React, { useState } from 'react'
import { JSBI, Pair, Percent } from '@sotatek-anhdao/smartdex-sdk'
import { darkColors, lightColors, baseColors } from 'style/Color'
import { Button, Card as UIKitCard, CardBody, Text } from 'uikit-sotatek'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import Card from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed } from '../Row'
import { Dots } from '../swap/styleds'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const HoverCard = styled(Card)`
  margin-top: 12px;
  border: 1px solid ${({ theme }) => (theme.isDark ? darkColors.borderColor : lightColors.borderColor)};
`

const TextStyle = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
  font-size: 12px;
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 16px;
  }
`

const UIKitCardStyle = styled(UIKitCard)`
  box-shadow: none;
  background-color: transparent;
`


const ButtonStyle = styled.div`
  width: 48%;
  a {
    color: #fff;
    font-size: 12px;
    padding: 0 12px;
    height: 45px;
    width: 100%;
    background: ${baseColors.primary};
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 16px;
      padding: 0 24px;
      height: 56px;
    }
  }
`

const IconBlock = styled.div`
 svg {
   stroke: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
 }
`
interface PositionCardProps {
  pair: Pair
  // eslint-disable-next-line react/no-unused-prop-types
  showUnwrapped?: boolean
}

export function MinimalPositionCard({ pair, showUnwrapped = false }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && (
        <UIKitCardStyle>
          <CardBody style={{ padding: '8px' }}>
            <AutoColumn gap="12px">
              <FixedHeightRow>
                <RowFixed>
                  <TextStyle style={{ textTransform: 'uppercase', fontWeight: 600 }} fontSize="14px" color="textSubtle">
                    LP Tokens in your Wallet
                  </TextStyle>
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow onClick={() => setShowMore(!showMore)}>
                <RowFixed>
                  <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
                  <TextStyle fontSize="14px">
                    {currency0.symbol}/{currency1.symbol}
                  </TextStyle>
                </RowFixed>
                <RowFixed>
                  <TextStyle fontSize="14px">{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</TextStyle>
                </RowFixed>
              </FixedHeightRow>
              <AutoColumn gap="4px">
                <FixedHeightRow>
                  <TextStyle fontSize="14px">{currency0.symbol}:</TextStyle>
                  {token0Deposited ? (
                    <RowFixed>
                      <TextStyle ml="6px" fontSize="14px">
                        {token0Deposited?.toSignificant(6)}
                      </TextStyle>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
                <FixedHeightRow>
                  <TextStyle fontSize="14px">{currency1.symbol}:</TextStyle>
                  {token1Deposited ? (
                    <RowFixed>
                      <TextStyle ml="6px" fontSize="14px">
                        {token1Deposited?.toSignificant(6)}
                      </TextStyle>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
              </AutoColumn>
            </AutoColumn>
          </CardBody>
        </UIKitCardStyle>
      )}
    </>
  )
}

export default function FullPositionCard({ pair }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return (
    <HoverCard>
      <AutoColumn gap="12px">
        <FixedHeightRow onClick={() => setShowMore(!showMore)} style={{ cursor: 'pointer' }}>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
            <TextStyle>
              {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </TextStyle>
          </RowFixed>
          <RowFixed>
            <IconBlock>
            {showMore ? (
              <ChevronUp size="20" style={{ marginLeft: '10px' }} />
            ) : (
              <ChevronDown size="20" style={{ marginLeft: '10px' }} />
            )}
            </IconBlock>
          </RowFixed>
        </FixedHeightRow>
        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <RowFixed>
                <TextStyle>Pooled {currency0.symbol}:</TextStyle>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <TextStyle ml="6px">{token0Deposited?.toSignificant(6)}</TextStyle>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <TextStyle>Pooled {currency1.symbol}:</TextStyle>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <TextStyle ml="6px">{token1Deposited?.toSignificant(6)}</TextStyle>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <TextStyle>Your pool tokens:</TextStyle>
              <TextStyle>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</TextStyle>
            </FixedHeightRow>
            <FixedHeightRow>
              <TextStyle>Your pool share:</TextStyle>
              <TextStyle>{poolTokenPercentage ? `${poolTokenPercentage.toFixed(2)}%` : '-'}</TextStyle>
            </FixedHeightRow>

            <RowBetween marginTop="10px">
              <ButtonStyle>
                <Button
                  as={Link}
                  to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`}
                >
                  Add
                </Button>
              </ButtonStyle>
              <ButtonStyle>
                <Button
                  as={Link}
                  to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                >
                  Remove
                </Button>
              </ButtonStyle>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </HoverCard>
  )
}

