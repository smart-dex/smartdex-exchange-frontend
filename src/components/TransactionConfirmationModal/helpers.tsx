import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { darkColors, lightColors } from 'style/Color'
import { Heading, IconButton, CloseIcon } from 'uikit-sotatek'
import { AutoColumn, ColumnCenter } from '../Column'

export const Wrapper = styled.div`
  width: 100%;
  overflow-y: auto;
`
export const Section = styled(AutoColumn)`
  padding: 24px;
`

export const ConfirmedIcon = styled(ColumnCenter)`
  padding: 40px 0;
`

export const BottomSection = styled(Section)`
  background-color: ${({ theme }) => theme.colors.invertedContrast};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

/**
 * TODO: Remove this when modal system from the UI Kit is implemented
 */
const StyledContentHeader = styled.div`
  align-items: center;
  display: flex;

  & > ${Heading} {
    flex: 1;
  }
`

const StyleIcon = styled.div`
width: 29px;
height: 29px;
border-radius: 50%;
justify-content: center;
display: flex;
background: ${ ({ theme}) => theme.isDark ? darkColors.iconClose : lightColors.iconClose} ;
  svg {
    fill: #fff;
  }
`
const HeadingStyle = styled(Heading)`
  font-size: 20px;
${({ theme }) => theme.mediaQueries.nav} {
  font-size: 24px;
}
`

type ContentHeaderProps = {
  children: ReactNode
  onDismiss: () => void
}

export const ContentHeader = ({ children, onDismiss }: ContentHeaderProps) => (
  <StyledContentHeader>
    <HeadingStyle>{children}</HeadingStyle>
    <IconButton onClick={onDismiss} variant="text">
      <StyleIcon>
        <CloseIcon />
      </StyleIcon>
    </IconButton>
  </StyledContentHeader>
)
