import { ChainId } from '@sotatek-anhdao/cake-sdk'
import React from 'react'
import { baseColors, darkColors, lightColors } from 'style/Color'
import styled  from 'styled-components'
import { Button, LinkExternal } from 'uikit-sotatek'
import { ArrowUpCircle } from 'react-feather'
import { AutoColumn } from '../Column'
import { getBscScanLink } from '../../utils'
import { Wrapper, Section, ConfirmedIcon, ContentHeader } from './helpers'

const LinkExternalStyle = styled(LinkExternal)`
  color: ${ baseColors.primary};
  background: none;
  svg {
    fill:  ${ baseColors.primary};
  }
`

const ButtonStyle = styled(Button)`
  background: ${ baseColors.primary};
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
        <ContentHeader onDismiss={onDismiss}>Transaction submitted</ContentHeader>
        <ConfirmedIcon>
          <ArrowUpCircle strokeWidth={0.5} size={97} color={baseColors.primary} />
        </ConfirmedIcon>
        <AutoColumn gap="8px" justify="center">
          {chainId && hash && (
            <LinkExternalStyle href={getBscScanLink(chainId, hash, 'transaction')}>View on BscScan</LinkExternalStyle>
          )}
          <ButtonStyle onClick={onDismiss} mt="20px">
            Close
          </ButtonStyle>
        </AutoColumn>
      </Section>
    </WrapperStyle>
  )
}

export default TransactionSubmittedContent
