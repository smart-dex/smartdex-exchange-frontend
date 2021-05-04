import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Heading, IconButton, Text, Flex, useModal } from 'smartdex-uikit'
import { lightColors, darkColors } from 'style/Color'
import { TranslateString } from 'utils/translateTextHelpers'
import SettingsModal from './SettingsModal'
import RecentTransactionsModal from './RecentTransactionsModal'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}

const StyledPageHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => (theme.isDark ? darkColors.borderColor : lightColors.borderColor)};
  padding: 23px 24px 19px 25px;
  ${({ theme }) => theme.mediaQueries.nav} {
    padding: 30px 34px 28px 49px;
  }
`

const Details = styled.div`
  flex: 1;
`
const HeadingStyle = styled(Heading)`
  font-size: 18px;
  line-height: 22px;
  font-weight: bold;
  color: ${({ theme }) => (theme.isDark ? darkColors.textSubtle : lightColors.textMenuLeft)};
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 24px;
    line-height: 29px;
  }
`

const StyledText = styled(Text)`
    font-size: 12px;
    line-height: 17px;
    color: ${({ theme }) => (theme.isDark ? darkColors.textSubtle : lightColors.titleMini)};
  ${({ theme }) => theme.mediaQueries.nav} {
    color: ${({ theme }) => (theme.isDark ? darkColors.titleMini : lightColors.titleMini)};
    font-size: 14px;
    font-weight: normal;
  }
`

const StyledCogIcon = styled.div`
    width: 16.55px;
    height: 17.48px;
    background-image: url('/images/setting-mobile-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.svg');
    background-size: 100%;
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 24.83px;
    height: 26.21px;
    background-image: url('/images/setting-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.svg');
  }
`

const StyledHistoryIcon = styled.div`
  width: 19px;
  height: 16px;
  background-image: url('/images/history-mobile-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 26.25px;
    height: 22.5px;
    background-image: url('/images/history-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.svg');
  }
`

const StyleButton = styled.div`
  button {
    width: 28px;
    height: 28px;
  }
  ${({ theme }) => theme.mediaQueries.nav} {
    button {
      width: 45px;
      height: 45px;
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
          <IconButton variant="text" onClick={onPresentSettings} title={TranslateString(1200, 'Settings')}>
            <StyledCogIcon />
          </IconButton>
          <IconButton variant="text" onClick={onPresentRecentTransactions} title={TranslateString(1207, 'Recent Transactions')}>
            <StyledHistoryIcon/>
          </IconButton>
        </StyleButton>
      </Flex>
      {children && <Text mt="16px">{children}</Text>}
    </StyledPageHeader>
  )
}

export default PageHeader
