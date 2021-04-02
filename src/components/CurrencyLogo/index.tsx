import { Currency, ETHER, Token } from '@sotatek-anhdao/smartdex-sdk'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { darkColors, lightColors } from 'style/Color'
import useHttpLocations from '../../hooks/useHttpLocations'
import { WrappedTokenInfo } from '../../state/lists/hooks'
import Logo from '../Logo'
import CoinLogo from '../pancake/CoinLogo'

const getTokenLogoURL = (address: string) =>
  `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/${address}/logo.png`

const StyledBnbLogo = styled.img<{ size: string }>`
  width: 24px;
  height: 24px;
  box-shadow: 0px 6px 10px rgba(0, 0, 0, 0.075);
  border-radius: 24px;
  stroke: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 30px;
    height: 30px;
  }
`

const StyledLogo = styled(Logo)<{ size: string }>`
  width: 24px;
  height: 24px;
  stroke: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 30px;
    height: 30px;
  }
`

const CoinLogoStyle = styled(CoinLogo)`
  width: 24px;
  height: 24px;
  stroke: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 30px;
    height: 30px;
  }
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency === ETHER) return []

    if (currency instanceof Token) {
      if (currency instanceof WrappedTokenInfo) {
        return [...uriLocations, `/images/coins/${currency?.symbol ?? 'token'}.png`, getTokenLogoURL(currency.address)]
      }

      return [`/images/coins/${currency?.symbol ?? 'token'}.png`, getTokenLogoURL(currency.address)]
    }
    return []
  }, [currency, uriLocations])

  if (currency === ETHER) {
    return <StyledBnbLogo src="/images/coins/bnb.png" size={size} style={style} />
  }

  return (currency as any)?.symbol ? (
    <CoinLogoStyle size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  ) : (
    <StyledLogo size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  )
}
