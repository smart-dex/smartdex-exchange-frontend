import React from 'react'
import styled from 'styled-components'
import { darkColors, lightColors } from 'style/Color'
import { Wrapper, Section, BottomSection, ContentHeader } from './helpers'

const WrapperStyle = styled(Wrapper)`
  background: ${({ theme }) => (theme.isDark ? darkColors.backgroundColor : lightColors.backgroundColor)};
`
const BottomSectionStyle = styled(BottomSection)`
  background: none;
`

type ConfirmationModalContentProps = {
  title: string
  onDismiss: () => void
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}

const ConfirmationModalContent = ({ title, bottomContent, onDismiss, topContent }: ConfirmationModalContentProps) => {
  return (
    <WrapperStyle>
      <Section>
        <ContentHeader onDismiss={onDismiss}>{title}</ContentHeader>
        {topContent()}
      </Section>
      <BottomSectionStyle gap="12px">{bottomContent()}</BottomSectionStyle>
    </WrapperStyle>
  )
}

export default ConfirmationModalContent
