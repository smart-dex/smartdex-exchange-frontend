import React from 'react'
import styled from 'styled-components'
import { Text } from 'smartdex-uikit'
import { darkColors, lightColors} from 'style/Color'
import { TranslateString } from 'utils/translateTextHelpers'
import { Spinner } from '../Shared'
import { AutoColumn } from '../Column'
import { Wrapper, Section, ConfirmedIcon, ContentHeader } from './helpers'

type ConfirmationPendingContentProps = { onDismiss: () => void; pendingText: string }

const CustomLightSpinner = styled(Spinner)<{ size: string }>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`

const TextStyle = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
`

const WrapperStyle = styled(Wrapper)`
  background: ${({ theme }) => (theme.isDark ? darkColors.backgroundColor : lightColors.backgroundColor)};
`

const ConfirmationPendingContent = ({ onDismiss, pendingText }: ConfirmationPendingContentProps) => {
  return (
    <WrapperStyle>
      <Section>
        <ContentHeader onDismiss={onDismiss}>{TranslateString(1217, "Waiting for confirmation")}</ContentHeader>
        <ConfirmedIcon>
          <CustomLightSpinner src="/images/blue-loader.svg" alt="loader" size="90px" />
        </ConfirmedIcon>
        <AutoColumn gap="12px" justify="center">
          <AutoColumn gap="12px" justify="center">
            <TextStyle fontSize="14px">
              <strong>{pendingText}</strong>
            </TextStyle>
          </AutoColumn>
          <TextStyle fontSize="14px">{TranslateString(1218, "Confirm this transaction in your wallet")}</TextStyle>
        </AutoColumn>
      </Section>
    </WrapperStyle>
  )
}

export default ConfirmationPendingContent
