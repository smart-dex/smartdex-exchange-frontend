import React from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Button, ButtonProps, ConnectorId, useWalletModal } from '@pancakeswap-libs/uikit'
import { injected, walletconnect } from 'connectors'
import useI18n from 'hooks/useI18n'
import { baseColors } from '../../style/Color'


const ButtonStyle = styled(Button)`
  background: ${baseColors.primary};
  border-radius: 10px;
  &:hover {
    background: #5ba7ec !important;
  }
  font-weight: 600;
  font-size: 13px;
  box-shadow: 0px 4px 10px rgba(83, 185, 234, 0.24);
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 16px;
  }
`

const UnlockButton: React.FC<ButtonProps> = props => {
  const TranslateString = useI18n()
  const { account, activate, deactivate } = useWeb3React()

  const handleLogin = (connectorId: ConnectorId) => {
    if (connectorId === 'walletconnect') {
      return activate(walletconnect)
    }
    return activate(injected)
  }

  const { onPresentConnectModal } = useWalletModal(handleLogin, deactivate, account as string)

  return (
    <ButtonStyle onClick={onPresentConnectModal} {...props}>
      {TranslateString(292, 'Unlock Wallet')}
    </ButtonStyle>
  )
}

export default UnlockButton
