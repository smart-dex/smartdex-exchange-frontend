import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import { connectorLocalStorageKey, ConnectorNames } from '@smartdex/uikit'
import useToast from 'hooks/useToast'
import { connectorsByName } from 'connectors'

const useAuth = () => {

  const { activate, deactivate } = useWeb3React()
  const { toastError, toastSuccess } = useToast()
  
  const login = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID]
    if (connector) {
      activate(connector, async (error: Error) => {
        window.localStorage.removeItem(connectorLocalStorageKey)
        if (error instanceof UnsupportedChainIdError) {
          toastError('Unsupported Chain Id', 'Unsupported Chain Id Error. Check your chain Id.')
        } else if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
          toastError('Provider Error', 'No provider was found')
        } else if (
          error instanceof UserRejectedRequestErrorInjected ||
          error instanceof UserRejectedRequestErrorWalletConnect
        ) {
          if (connector instanceof WalletConnectConnector) {
            const walletConnector = connector as WalletConnectConnector
            walletConnector.walletConnectProvider = null
          }
          toastError('Authorization Error', 'Please authorize to access your account')
        }
      })

      const iframe = document.getElementById("iframe-x-finance")

      if (iframe instanceof HTMLIFrameElement) {
        const win = iframe.contentWindow;
        if (win) {
          win.postMessage({ key: connectorLocalStorageKey, value: "injected" }, "*")
        }
      }

    } else {
      toastError("Can't find connector", 'The connector config is wrong')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const logout = () => {
    deactivate()
    const iframe = document.getElementById("iframe-x-finance")

    if (iframe instanceof HTMLIFrameElement) {
      const win = iframe.contentWindow;
      if (win){
        win.postMessage({ action: "remove", key: connectorLocalStorageKey }, "*")
      }
    }
  }

  return { login, logout }
}

export default useAuth