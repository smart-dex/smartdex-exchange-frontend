import { ChainId } from '@sotatek-anhdao/smartdex-sdk'
import React from 'react'
import { baseColors, darkColors, lightColors } from 'style/Color'
import styled  from 'styled-components'
import { Button, LinkExternal } from 'smartdex-uikit'
import { ArrowUpCircle } from 'react-feather'
import { TranslateString } from 'utils/translateTextHelpers'
import { AutoColumn } from '../Column'
import { getBscScanLink } from '../../utils'
import { Wrapper, Section, ConfirmedIcon, ContentHeader } from './helpers'

const LinkExternalStyle = styled(LinkExternal)`
  color: ${ baseColors.primary};
  background: none;
  width: 100%;
  svg {
    fill:  ${ baseColors.primary};
  }
`

const ButtonStyle = styled(Button)`
  background: ${ baseColors.primary};
  font-size: 12px;
  height: 45px;
  padding: 0 24px;
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 16px;
    height: 56px;
  }
`

const WrapperStyle = styled(Wrapper)`
  background: ${({ theme }) => (theme.isDark ? darkColors.backgroundColor : lightColors.backgroundColor)};
`

type TransactionSubmittedContentProps = {
  onDismiss: () => void
  hash: string | undefined
  chainId: ChainId
}

const TransactionSubmittedContent = ({ onDismiss, chainId, hash }: TransactionSubmittedContentProps) => {

  return ( 
    <WrapperStyle>
      <Section>
        <ContentHeader onDismiss={onDismiss}>{TranslateString(1220, "Transaction submitted")}</ContentHeader>
        <ConfirmedIcon>
          <ArrowUpCircle strokeWidth={0.5} size={97} color={baseColors.primary} />
        </ConfirmedIcon>
        <AutoColumn gap="8px" justify="center">
          {chainId && hash && (
            <LinkExternalStyle href={getBscScanLink(chainId, hash, 'transaction')}>{TranslateString(356, "View on BscScan")}</LinkExternalStyle>
          )}
          <ButtonStyle onClick={onDismiss} mt="20px">
            {TranslateString(438, "Close")}
          </ButtonStyle>
        </AutoColumn>
      </Section>
    </WrapperStyle>
  )
}

export default TransactionSubmittedContent
