import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { lightColors, darkColors, baseColors } from 'style/Color'
import { ButtonMenu, ButtonMenuItem } from 'uikit-sotatek'
import TranslatedText from '../TranslatedText'

const StyledNav = styled.div`
  margin-bottom: 40px;
  &>div {
    background: ${({ theme }) => (theme.isDark ? darkColors.darkText : lightColors.activeBackgroundMenuLeft)} !important;
  }
  .active {
    background: ${baseColors.primary};
    box-shadow: 0px 4px 10px rgba(83, 185, 234, 0.24);
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    color: ${darkColors.textLogoMenuLeft};
    &:hover {
      background: ${baseColors.primary};
      opacity: 0.65;
    }
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 16px;
      line-height: 20px;
    }
  }
  .not-active {
    font-weight: normal;
  }
  & a {
    color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
    height: 45px;
    font-size: 13px;
    padding: 0 20px;
    
    background: none;
    line-height: 20px;
    border-radius: 50px;
    &:hover {
      background: none;
    }
    &:focus {
      box-shadow: 'none',
    }
  }  
  &>div {
    background: ${lightColors.activeBackgroundMenuLeft};
    border-radius: 50px;
  }
  ${({ theme }) => theme.mediaQueries.nav} {
    & a {
      height: 56px;
      padding: 0 35px;
      font-size: 16px;
      font-weight: normal;
    }
  }
`

const Nav = ({ activeIndex = 0 }: { activeIndex?: number }) => (
  <StyledNav>
    <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
      <ButtonMenuItem className={activeIndex === 0 ? 'active' : 'not-active'} id="swap-nav-link" to="/swap" as={Link}>
        <TranslatedText translationId={8}>Swap</TranslatedText>
      </ButtonMenuItem>
      <ButtonMenuItem className={activeIndex === 1 ? 'active' : 'not-active'} id="pool-nav-link" to="/pool" as={Link}>
        <TranslatedText translationId={74}>Liquidity</TranslatedText>
      </ButtonMenuItem>
      <ButtonMenuItem
        className='not-active'
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
