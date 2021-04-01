import React, { useContext, useEffect } from 'react'
import { ConnectorId } from '@pancakeswap-libs/uikit'
import { Menu as UikitMenu } from 'uikit-sotatek'
import { useWeb3React } from '@web3-react/core'
import { allLanguages } from 'constants/localisation/languageCodes'
import { LanguageContext } from 'hooks/LanguageContext'
import useTheme from 'hooks/useTheme'
import useGetPriceData from 'hooks/useGetPriceData'
import useGetLocalProfile from 'hooks/useGetLocalProfile'
import { injected, bsc, walletconnect } from 'connectors'
import links from './config'

const Menu: React.FC = (props) => {
  const { account, activate, deactivate } = useWeb3React()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const priceData = useGetPriceData()
  // TO-DO
  const sdcPriceUsd = priceData ? Number(priceData.prices.Sdc) : undefined
  const profile = useGetLocalProfile()

  useEffect(() => {
    if (!account && window.localStorage.getItem('connectorId')) {
      activate(injected)
    }
  }, [account, activate])

  return (
    <UikitMenu
      links={links}
      account={account as string}
      login={(connectorId: ConnectorId) => {
        if (connectorId === 'walletconnect') {
          return activate(walletconnect)
        }

        if (connectorId === 'bsc') {
          return activate(bsc)
        }

        return activate(injected)
      }}
      logout={deactivate}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage?.code || ''}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      cakePriceUsd={sdcPriceUsd}
      profile={profile}
      {...props}
    />
  )
}

export default Menu
