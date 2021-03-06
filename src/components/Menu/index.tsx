import React, { useContext, useEffect } from 'react'
import { ConnectorId } from '@pancakeswap-libs/uikit'
import { Menu as UikitMenu } from 'smartdex-uikit'
import { useWeb3React } from '@web3-react/core'
import { allLanguages } from 'constants/localisation/languageCodes'
import { LanguageContext } from 'hooks/LanguageContext'
import useTheme from 'hooks/useTheme'
import useGetPriceData from 'hooks/useGetPriceData'
import useGetLocalProfile from 'hooks/useGetLocalProfile'
import useAuth from 'hooks/useAuth'
import { injected } from 'connectors'
import { TranslateString } from 'utils/translateTextHelpers'
import { useGlobalData } from '../../contexts/GlobalData'

const Menu = (props) => {
  const { account, activate, deactivate } = useWeb3React()
  const { login, logout } = useAuth()
  const { selectedLanguage, setSelectedLanguage } = useContext(LanguageContext)
  const { isDark, toggleTheme } = useTheme()
  const {sdcPriceUsd} = useGlobalData()
  if (sdcPriceUsd || sdcPriceUsd === 0) {
    localStorage.setItem("sdcPrice",sdcPriceUsd.toString())
  }
  const sdcPriceLocalStorage = Number(localStorage.getItem("sdcPrice"))

  const showSdcPrice = sdcPriceUsd ||  sdcPriceLocalStorage

  // TO-DO
  const profile = useGetLocalProfile()

  useEffect(() => {
    if (!account && window.localStorage.getItem('connectorId')) {
      activate(injected)
    }
  }, [account, activate])

  const configLink = [
    {
      label: `${TranslateString(670, 'Home')}`,
      icon: 'HomeIcon',
      href: `${process.env.REACT_APP_FINANCE_URL}`,
    },
    {
      label: `${TranslateString(672, 'Trade')}`,
      icon: 'TradeIcon',
      initialOpenState: true,
      items: [
        {
          label: `${TranslateString(8, 'Exchange')}`,
          href: '/swap',
        },
        {
          label: `${TranslateString(262, 'Liquidity')}`,
          href: '/pool',
        },
      ],
    },
    {
      label: `${TranslateString(674, 'Farms')}`,
      icon: 'FarmIcon',
      href: `${process.env.REACT_APP_FINANCE_URL}/farms`,
    },
    // {
    //   label: `${TranslateString(676, 'Pools')}`,
    //   icon: 'PoolIcon',
    //   href: `${process.env.REACT_APP_FINANCE_URL}/pools`,
    // },
    // {
    //   label: `${TranslateString(14, 'Lottery')}`,
    //   icon: 'TicketIcon',
    //   href: `${process.env.REACT_APP_FINANCE_URL}/lottery`,
    // },
    // {
    //   label: `${TranslateString(12215, 'Collectibles')}`,
    //   icon: 'NftIcon',
    //   href: `${process.env.REACT_APP_FINANCE_URL}/collectibles`,
    // },
    // {
    //   label: `${TranslateString(12216, 'Teams & Profile')}`,
    //   icon: 'GroupsIcon',
    //   items: [
    //     {
    //       label: `${TranslateString(12217, 'Leaderboard')}`,
    //       href: `${process.env.REACT_APP_FINANCE_URL}/teams`,
    //     },
    //     {
    //       label: `${TranslateString(1090, 'Task Center')}`,
    //       href: `${process.env.REACT_APP_FINANCE_URL}/tasks`,
    //     },
    //     {
    //       label: `${TranslateString(12218, 'Your Profile')}`,
    //       href: `${process.env.REACT_APP_FINANCE_URL}/profile`,
    //     },
    //   ],
    // },
    {
      label: `${TranslateString(680, 'Info')}`,
      icon: 'InfoIcon',
      items: [
        {
          label: `${TranslateString(688, 'Overview')}`,
          href: `${process.env.REACT_APP_INFO_URL}/home`,
        },
        {
          label: `${TranslateString(12223, 'Tokens')}`,
          href: `${process.env.REACT_APP_INFO_URL}/tokens`,
        },
        {
          label: `${TranslateString(692, 'Pairs')}`,
          href: `${process.env.REACT_APP_INFO_URL}/pairs`,
        },
        {
          label: `${TranslateString(694, 'Accounts')}`,
          href: `${process.env.REACT_APP_INFO_URL}/accounts`,
        },
      ],
    },
    {
      label: 'IFO',
      icon: 'IfoIcon',
      href: `${process.env.REACT_APP_FINANCE_URL}/ifo`,
    },
    {
      label: `${TranslateString(684, 'More')}`,
      icon: 'MoreIcon',
      items: [
        {
          label: `${TranslateString(12, 'Voting')}`,
          href: `${process.env.REACT_APP_VOTING}`,
        },
        {
          label: 'Github',
          href: `${process.env.REACT_APP_GIT}`,
        },
        {
          label: `${TranslateString(10, 'Docs')}`,
          href: `${process.env.REACT_APP_DOCS_URL}`,
        },
      ],
    },
  ]

  const linkMyPage = [
    {
      label: `${TranslateString(12219, "My Page")}`,
      icon: "MyPageIcon",
      items: [
        {
          label: `${TranslateString(12220, "Wallet")}`,
          href: `${process.env.REACT_APP_FINANCE_URL}/wallet`,
        },
        {
          label: `${TranslateString(12221, "Referral")}`,
          href: `${process.env.REACT_APP_FINANCE_URL}/referral`,
        },
        {
          label: `${TranslateString(12222, "Referral Management")}`,
          href: `${process.env.REACT_APP_FINANCE_URL}/referral-management`,
        },
      ],
    },
  ];

  return (
    <UikitMenu
      links={configLink}
      account={account as string}
      login={login}
      logout={logout}
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={selectedLanguage?.code || ''}
      langs={allLanguages}
      setLang={setSelectedLanguage}
      cakePriceUsd={showSdcPrice}
      linkMyPage={linkMyPage}
      profile={profile}
      {...props}
    />
  )
}

export default Menu
