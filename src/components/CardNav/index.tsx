import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap-libs/uikit'
import TranslatedText from '../TranslatedText'
import {SelectButtonStyle} from '../../style/Button'

const StyledNav = styled.div`
  margin-bottom: 40px;
  @media(max-width: 767px) {
    &>div {
      background: ${({ theme }) => (theme.isDark ? "rgba(233, 244, 252, 0.1) !important" : "#E9F4FC")};
    }
    .sc-dlfnbm.gZSYVP.sc-iqHYGH.gsnKmh {
      color: ${({ theme }) => (theme.isDark ? "rgba(255, 255, 255, 0.87) !important" : "")};
      font-weight: normal !important;
    }
    .sc-dlfnbm.gasPXd.sc-iqHYGH.kKBchV {
      font-weight: normal !important;
    }
  }
  ${SelectButtonStyle}
`

const Nav = ({ activeIndex = 0 }: { activeIndex?: number }) => (
  <StyledNav>
    <ButtonMenu activeIndex={activeIndex} size="sm" variant="subtle">
      <ButtonMenuItem id="swap-nav-link" to="/swap" as={Link}>
        <TranslatedText translationId={8}>Swap</TranslatedText>
      </ButtonMenuItem>
      <ButtonMenuItem id="pool-nav-link" to="/pool" as={Link}>
        <TranslatedText translationId={74}>Liquidity</TranslatedText>
      </ButtonMenuItem>
      <ButtonMenuItem
        id="pool-nav-link"
        as="a"
        href="https://www.binance.org/en/bridge?utm_source=PancakeSwap"
        target="_blank"
        rel="noreferrer noopener"
      >
        Bridge
      </ButtonMenuItem>
    </ButtonMenu>
  </StyledNav>
)

export default Nav
