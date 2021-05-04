import React from 'react'
import styled from 'styled-components'
import { Button, Text } from 'smartdex-uikit'
import { AlertTriangle } from 'react-feather'
import { baseColors, darkColors, lightColors } from 'style/Color'
import { TranslateString } from 'utils/translateTextHelpers'
import { AutoColumn } from '../Column'
import { Wrapper, Section, BottomSection, ContentHeader } from './helpers'

const ButtonStyle = styled(Button)`
  color: #fff;
  font-size: 12px;
  padding: 0 12px;
  height: 45px;
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 16px;
    padding: 0 24px;
    height: 56px;
  }
`

const TextStyle = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
`
const WrapperStyle = styled(Wrapper)`
  background: ${({ theme }) => (theme.isDark ? darkColors.backgroundColor : lightColors.backgroundColor)};
`

type TransactionErrorContentProps = { message: string; onDismiss: () => void }

const TransactionErrorContent = ({ message, onDismiss }: TransactionErrorContentProps) => {
  
  return (
    <WrapperStyle>
      <Section>
        <ContentHeader onDismiss={onDismiss}>{ TranslateString(1236, "Error")}</ContentHeader>
        <AutoColumn style={{ marginTop: 20, padding: '2rem 0' }} gap="24px" justify="center">
          <AlertTriangle  style={{ strokeWidth: 1.5, color: '#ED4B9E' }} size={64} />
          <TextStyle fontSize="16px" color="failure" style={{ textAlign: 'center', width: '85%' }}>
            { message === 'Transaction rejected.' ? TranslateString(1235, 'Transaction rejected.') : message}
          </TextStyle>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <ButtonStyle  onClick={onDismiss} style={{ background: baseColors.primary}}>{TranslateString(1219, "Dismiss")}</ButtonStyle>
      </BottomSection>
    </WrapperStyle>
  )
}

export default TransactionErrorContent
