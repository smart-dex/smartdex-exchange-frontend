import React from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Button, ButtonProps, useWalletModal } from 'uikit-sotatek'
import { ConnectorId } from '@pancakeswap-libs/uikit'
import { injected, walletconnect } from 'connectors'
import useI18n from 'hooks/useI18n'
import { baseColors } from 'style/Color'

const ButtonStyle = styled.div`
  button {
    width: 100%;
    background: ${baseColors.primary};
    border-radius: 10px;
    font-weight: 600;
    font-size: 13px;
    height: 45px;
    box-shadow: 0px 4px 10px rgba(83, 185, 234, 0.24);
    &:hover {
      background: #5ba7ec !important;
    }
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 16px;
      height: 56px;
    }
    p {
      padding-right: 8px;
    }
    svg {
      width: 10px;
      height: 10px;
      ${({ theme }) => theme.mediaQueries.nav} {
        width: 16px;
       height: 16px;
      }
    }
  }
`

const UnlockButton: React.FC<ButtonProps> = (props) => {
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
    <ButtonStyle>
      <Button onClick={onPresentConnectModal} {...props}>
        <p>{TranslateString(292, 'Unlock Wallet')}</p> 
        <svg  viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" >
          <path
            d="M13.8913 0.110002L0.898166 6.10688C-0.600897 6.80656 -0.101209 9.00531 1.49785 9.00531H6.99504V14.5025C6.99504 16.1016 9.19379 16.6016 9.89348 15.1022L15.8904 2.10906C16.39 0.909376 15.0907 -0.389998 13.8913 0.110002Z"
            fill="white"
          />
        </svg>
      </Button>
    </ButtonStyle>
  )
}

export default UnlockButton
