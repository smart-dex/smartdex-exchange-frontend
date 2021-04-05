import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { lightColors, darkColors } from 'style/Color'
import { ButtonMenu, ButtonMenuItem } from 'uikit-sotatek'

const StyledNav = styled.div`
  margin-bottom: 12px;
  ${({ theme }) => theme.mediaQueries.nav} {
    margin-bottom: 0px;
    width: 218px;
  }
  & > div {
    display: flex;
    flex-direction: row;
    background-color: initial;
    ${({ theme }) => theme.mediaQueries.nav} {
      flex-direction: column;
    }
  }
  .active {
    width: 100%;
    flex-direction: column;
    & > div {
      & > div {
        height: 61.25px;
        width: 61.25px;
        background-image: url('/images/iconTabActive.png');
        background-size: cover;
        ${({ theme }) => theme.mediaQueries.nav} {
          height: 87.5px;
          width: 87.5px;
        }
      }
    }
    font-weight: 600;
    font-size: 13px;
    line-height: 16px;
    box-shadow: none;
    &:hover {
      opacity: 0.65;
    }
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 16px;
      line-height: 20px;
    }
  }
  .not-active {
    font-weight: normal;
    width: 100%;
    justify-content: flex-end;
    & > div {
      & > div {
        height: 40.25px;
        width: 40.25px;
        background-image: url('/images/iconTab.png');
        background-repeat: no-repeat;
        background-size: cover;
        ${({ theme }) => theme.mediaQueries.nav} {
          height: 56.88px;
          width: 56.88px;
        }
      }
    }
  }
  & a {
    color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
    height: 15vh;
    font-size: 13px;
    padding: 0 20px;
    background: none;

    &:hover {
      background: none;
    }
    &:focus {
      box-shadow: 'none';
    }
  }
  & > div {
    border-radius: 50px;
  }
  .text-active {
    text-align: center;
  }

  .text-not-active {
    justify-content: flex-end;
    display: flex;
  }
  ${({ theme }) => theme.mediaQueries.nav} {
    & a {
      height: 20vh;
      padding: 0 35px;
      font-size: 16px;
      font-weight: normal;
    }
  }
`

const IconTab = styled.div``

const TextTab = styled.p`
  padding-top: 15px;
`

const TabBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const arrIndex = [
  { index: 0, text: 'Exchange', id: 'swap-page', route: '/swap' },
  { index: 1, text: 'Liquidity', id: 'pool-nav-link', route: '/pool' },
]

const Nav = ({ activeIndex = 0 }: { activeIndex?: number }) => {
  const [stateIndex, setStateIndex] = useState(arrIndex)

  useEffect(() => {
    if (activeIndex === 1) {
      setStateIndex([arrIndex[1], arrIndex[0]])
    } else setStateIndex(arrIndex)
  }, [activeIndex])

  return (
    <StyledNav>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="subtle">
        <div>
          <ButtonMenuItem
            className="not-active"
            id="pool-nav-link"
            as="a"
            href="https://www.binance.org/en/bridge?utm_source=PancakeSwap"
            target="_blank"
            rel="noreferrer noopener"
          >
            <TabBlock>
              <IconTab />
              <TextTab className="text-not-active">
                Bridge
              </TextTab>
            </TabBlock>
          </ButtonMenuItem>
        </div>
        <>
          {stateIndex.map((item) => (
            <>
              <ButtonMenuItem
                className={activeIndex === item.index ? 'active' : 'not-active'}
                to={item.route}
                as={Link}
                id={item.id}
              >
                <TabBlock>
                  <IconTab />
                  <TextTab className={activeIndex === item.index ? 'text-active' : 'text-not-active'}>
                    {item.text}
                  </TextTab>
                </TabBlock>
              </ButtonMenuItem>
            </>
          ))}
        </>
      </ButtonMenu>
    </StyledNav>
  )
}
export default Nav
