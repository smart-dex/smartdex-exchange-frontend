import { MenuEntry } from 'smartdex-uikit'

const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: `${process.env.REACT_APP_FINANCE_URL}`,
  },
  {
    label: 'Trade',
    icon: 'TradeIcon',
    initialOpenState: true,
    items: [
      {
        label: 'Exchange',
        href: '/swap',
      },
      {
        label: 'Liquidity',
        href: '/pool',
      },
    ],
  },
  {
    label: 'Farms',
    icon: 'FarmIcon',
    href: `${process.env.REACT_APP_FINANCE_URL}/farms`,
  },
  {
    label: 'Pools',
    icon: 'PoolIcon',
    href: `${process.env.REACT_APP_FINANCE_URL}/pools`,
  },
  {
    label: 'Lottery',
    icon: 'TicketIcon',
    href: `${process.env.REACT_APP_FINANCE_URL}/lottery`,
  },
  {
    label: 'Collectibles',
    icon: 'NftIcon',
    href: `${process.env.REACT_APP_FINANCE_URL}/collectibles`,
  },
  {
    label: 'Teams & Profile',
    icon: 'GroupsIcon',
    items: [
      {
        label: 'Leaderboard',
        href: `${process.env.REACT_APP_FINANCE_URL}/teams`,
      },
      {
        label: 'Task Center',
        href: `${process.env.REACT_APP_FINANCE_URL}/tasks`,
      },
      {
        label: 'Your Profile',
        href: `${process.env.REACT_APP_FINANCE_URL}/profile`,
      },
    ],
  },
  {
    label: 'Info',
    icon: 'InfoIcon',
    items: [
      {
        label: 'Overview',
        href: `${process.env.REACT_APP_INFO_URL}/home`,
      },
      {
        label: 'Tokens',
        href: `${process.env.REACT_APP_INFO_URL}/tokens`,
      },
      {
        label: 'Pairs',
        href: `${process.env.REACT_APP_INFO_URL}/pairs`,
      },
      {
        label: 'Accounts',
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
    label: 'More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Voting',
        href: '',
      },
      {
        label: 'Github',
        href: '',
      },
      {
        label: 'Docs',
        href: `${process.env.REACT_APP_DOCS_URL}`,
      },
      {
        label: 'Blog',
        href: '',
      },
    ],
  },
]

export default config
