import React from 'react'
import styled from 'styled-components'
import { Card } from '@pancakeswap-libs/uikit'
import { lightColors, darkColors } from 'style/Color'

export const BodyWrapper = styled(Card)`
  background: ${({ theme }) => (theme.isDark ? darkColors.backgroundColor : lightColors.backgroundColor)};
  position: relative;
  max-width: 436px;
  width: 100%;
  z-index: 5;
  border: 1px solid ${({ theme }) => (theme.isDark ? darkColors.borderColor : lightColors.borderColor)};
  box-shadow: 10px 10px 102px rgba(120, 118, 148, 0.14);
  border-radius: 40px;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
