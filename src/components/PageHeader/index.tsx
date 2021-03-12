import React, { ReactNode } from 'react'
import styled from 'styled-components'
import { Heading, Text, Flex, useModal, IconButton } from 'uikit-sotatek'

import SettingsModal from './SettingsModal'
import RecentTransactionsModal from './RecentTransactionsModal'
import { lightColors } from '../../style/Color'

interface PageHeaderProps {
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
}

const StyledPageHeader = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding: 24px;
`

const Details = styled.div`
  flex: 1;
`

const Styledheading = styled(Heading)`
  color: ${({ theme }) => (theme.isDark ? lightColors.background : lightColors.textMenuLeft)}
`

const StyledText = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? lightColors.background : lightColors.textMenuLeft)}
`

const StyledCogIcon = styled.div`
  width: 19px;
  height: 20.2px;
  background-image: url('/images/setting-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.png');
  background-size: 100%;
  
`

const StyledHistoryIcon = styled.div`
  width: 26.25px;
  height: 22.5px;
  background-image: url('/images/history-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.png');
  background-repeat: no-repeat;
  background-position: center;
`

const PageHeader = ({ title, description, children }: PageHeaderProps) => {
  const [onPresentSettings] = useModal(<SettingsModal />)
  const [onPresentRecentTransactions] = useModal(<RecentTransactionsModal />)

  return (
    <StyledPageHeader>
      <Flex alignItems="center">
        <Details>
          <Styledheading mb="8px">{title}</Styledheading>
          {description && (
            <StyledText color="textSubtle" fontSize="14px">
              {description}
            </StyledText>
          )}
        </Details>
        <IconButton variant="text" onClick={onPresentSettings} title="Settings">
          <StyledCogIcon />
        </IconButton>
        <IconButton variant="text" onClick={onPresentRecentTransactions} title="Recent transactions">
          <StyledHistoryIcon/>
        </IconButton>
      </Flex>
      {children && <Text mt="16px">{children}</Text>}
    </StyledPageHeader>
  )
}

export default PageHeader
