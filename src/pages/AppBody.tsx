import React from 'react'
import styled from 'styled-components'
import { Card } from 'smartdex-uikit'
import { lightColors, darkColors, baseColors } from 'style/Color'

export const BodyWrapper = styled(Card)`
  background: ${({ theme }) => (theme.isDark ? darkColors.backgroundColor : lightColors.backgroundColor)};
  border: 1px solid ${({ theme }) => (theme.isDark ? darkColors.borderColor : lightColors.borderColor)};
  box-shadow: 14px 14px 20px rgba(120, 118, 148, 0.1);
  border-radius: 30px;
  width: 334px;
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 530px;
    border-left: 20px solid ${baseColors.primary};
    border-radius: 10px;
  }
`
const ArrowLeft = styled.div`
  display: none;
  width: 20px;
  height: 20px;
  ${({ theme }) => theme.mediaQueries.nav} {
    display: block;
    margin-left: 42px;
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-right:25px solid ${baseColors.primary};
  }
`

const BlockWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return (
    <BlockWrapper>
      <ArrowLeft/>
      <BodyWrapper> 
        
        {children}
      </BodyWrapper>
    </BlockWrapper>
    
  )
}
