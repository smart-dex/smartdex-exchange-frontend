import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Heading, IconButton, Text, Flex, useModal, CogIcon, Svg } from '@pancakeswap-libs/uikit'
import SettingsModal from './SettingsModal'
import RecentTransactionsModal from './RecentTransactionsModal'
import { lightColors, darkColors } from '../../style/Color'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}

const HistoryIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <path
      d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z"
      fill="currentColor"
    />
  </Svg>
)

const StyledPageHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding: 24px;
`

const Details = styled.div`
  flex: 1;
`
const HeadingStyle = styled(Heading)`
  font-size: 24px;
  line-height: 29px;
  font-weight: 700;
  color: ${({ theme }) => (theme.isDark ? darkColors.textSubtle : lightColors.textMenuLeft)};
  @media(max-width: 767px) {
    font-size: 18px;
    line-height: 22px;
  }
`

const StyledText = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? darkColors.titleMini : lightColors.titleMini)};
  font-size: 14px;
  @media(max-width: 767px) {
    font-size: 12px;
    line-height: 15px;
    color: ${({ theme }) => (theme.isDark ? darkColors.textSubtle : lightColors.titleMini)};
  }
`

const StyledCogIcon = styled.div`
  width: 24.83px;
  height: 26.21px;
  background-image: url('/images/setting-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.svg');
  background-size: 100%;
  @media(max-width: 767px) {
    width: 16.55px;
    height: 17.48px;
    background-image: url('/images/setting-mobile-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.svg');
  }
`

const StyledHistoryIcon = styled.div`
  width: 26.25px;
  height: 22.5px;
  background-image: url('/images/history-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.svg');
  background-repeat: no-repeat;
  background-position: center;
  @media(max-width: 767px) {
    height: 15px;
    background-image: url('/images/history-mobile-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.svg');
  }
`

const StyleButton = styled.div`
  @media(max-width: 767px) {
    button {
      width: 28px;
      height: 28px;
    }
  }
`

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  const [onPresentSettings] = useModal(<SettingsModal />)
  const [onPresentRecentTransactions] = useModal(<RecentTransactionsModal />)

  return (
    <StyledPageHeader>
      <Flex alignItems="center">
        <Details>
          <HeadingStyle mb="8px">{title}</HeadingStyle>
          {description && (
            <StyledText color="textSubtle">
              {description}
            </StyledText>
          )}
        </Details>
        <StyleButton>
          <IconButton variant="text" onClick={onPresentSettings} title="Settings">
            <StyledCogIcon />
          </IconButton>
          <IconButton variant="text" onClick={onPresentRecentTransactions} title="Recent transactions">
            <StyledHistoryIcon/>
          </IconButton>
        </StyleButton>
      </Flex>
      {children && <Text mt="16px">{children}</Text>}
    </StyledPageHeader>
  )
}

export default PageHeader
