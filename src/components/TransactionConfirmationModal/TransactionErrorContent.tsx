import React from 'react'
import styled from 'styled-components'
import { Button, Text } from 'uikit-sotatek'
import { AlertTriangle } from 'react-feather'
import { baseColors } from 'style/Color'
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

type TransactionErrorContentProps = { message: string; onDismiss: () => void }

const TransactionErrorContent = ({ message, onDismiss }: TransactionErrorContentProps) => {
  
  return (
    <Wrapper>
      <Section>
        <ContentHeader onDismiss={onDismiss}>Error</ContentHeader>
        <AutoColumn style={{ marginTop: 20, padding: '2rem 0' }} gap="24px" justify="center">
          <AlertTriangle  style={{ strokeWidth: 1.5, color: baseColors.primary}} size={64} />
          <Text fontSize="16px" color="failure" style={{ textAlign: 'center', width: '85%' }}>
            {message}
          </Text>
        </AutoColumn>
      </Section>
      <BottomSection gap="12px">
        <ButtonStyle  onClick={onDismiss} style={{ background: baseColors.primary}}>Dismiss</ButtonStyle>
      </BottomSection>
    </Wrapper>
  )
}

export default TransactionErrorContent
