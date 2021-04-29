import React from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Button, ButtonProps, useWalletModal } from 'smartdex-uikit'
import { ConnectorId } from '@pancakeswap-libs/uikit'
import { injected, walletconnect } from 'connectors'
import useI18n from 'hooks/useI18n'
import { baseColors, darkColors, lightColors } from 'style/Color'
import useAuth from '../../hooks/useAuth'

const ButtonStyle = styled.div`
button {
  background: ${({ theme }) => (theme.isDark ? darkColors.buttonView : lightColors.buttonView)};
  color: ${baseColors.primary};
  border-radius: 10px;
  box-shadow: 0px 4px 10px ${({theme}) => theme.isDark ? darkColors.boxShadow : lightColors.boxShadow};
  height: 45px;
  font-weight: 600;
  font-size: 13px;
  position: relative;
  padding-right: 24px;
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 16px;
    height: 56px;
    padding-right: 36px;
  }
}
  
`

const UnlockButton: React.FC<ButtonProps> = (props) => {
  const TranslateString = useI18n()
  const { account, deactivate } = useWeb3React()
  const { login } = useAuth()

  const { onPresentConnectModal } = useWalletModal(login, deactivate, account as string)

  return (
    <ButtonStyle>
      <Button onClick={onPresentConnectModal} {...props}>
        {TranslateString(292, 'Unlock Wallet')} 
      </Button>
    </ButtonStyle>
    
  )
}

export default UnlockButton
