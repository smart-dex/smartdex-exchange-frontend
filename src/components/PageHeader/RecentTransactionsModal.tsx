import React, { useMemo } from 'react'
import styled from 'styled-components'
import { baseColors, darkColors, lightColors } from 'style/Color'
import { CheckmarkCircleIcon, ErrorIcon, Flex, LinkExternal, Text, Modal, Button } from 'uikit-sotatek'
import { useActiveWeb3React } from 'hooks'
import { getBscScanLink } from 'utils'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import Loader from 'components/Loader'

type RecentTransactionsModalProps = {
  onDismiss?: () => void
}

// TODO: Fix UI Kit typings
const defaultOnDismiss = () => null

const newTransactionsFirst = (a: TransactionDetails, b: TransactionDetails) => b.addedTime - a.addedTime

const getRowStatus = (sortedRecentTransaction: TransactionDetails) => {
  const { hash, receipt } = sortedRecentTransaction

  if (!hash) {
    return { icon: <Loader />, color: 'text' }
  }

  if (hash && receipt?.status === 1) {
    return { icon: <CheckmarkCircleIcon color="success" />, color: 'success' }
  }

  return { icon: <ErrorIcon color="failure" />, color: 'failure' }
}

const RecentTransactionsModal = ({ onDismiss = defaultOnDismiss }: RecentTransactionsModalProps) => {
  const { account, chainId } = useActiveWeb3React()
  const allTransactions = useAllTransactions()

  // Logic taken from Web3Status/index.tsx line 175
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst)
  }, [allTransactions])

  const StyleText = styled(Text)`
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => (theme.isDark ? darkColors.textSubtle : lightColors.textMenuLeft)};
    ${({ theme }) => theme.mediaQueries.nav} {
      font-size: 16px;
    }
  `

  const StyleButton = styled(Text)`
    font-weight: 600;
    button {
      color: ${lightColors.background};
      background: ${baseColors.primary};
      border-radius: 10px;
      height: 45px;
      font-size: 13px;
    }
    ${({ theme }) => theme.mediaQueries.nav} {
      button {
        height: 50px;
        font-size: 16px;
      }
    }
  `

  const LinkExternalStyle = styled(LinkExternal)`
  color: ${({ theme }) => (theme.isDark ? darkColors.textSubtle : lightColors.textMenuLeft)};
  width: 100%;
  background: none;
  justify-content: flex-start;
    svg {
      margin-left: 4px;
      fill: #0085FF;
  }
  `

  return (
    <Modal title="Recent Transactions" onDismiss={onDismiss}>
      {!account && (
        <Flex justifyContent="center" flexDirection="column" alignItems="center">
          <Text mb="8px" bold>
            <StyleText>Please connect your wallet to view your recent transactions</StyleText>
          </Text>
          <StyleButton>
            <Button variant="tertiary" size="sm" onClick={onDismiss}>
              Close
            </Button>
          </StyleButton>
        </Flex>
      )}
      {account && chainId && sortedRecentTransactions.length === 0 && (
        <Flex justifyContent="center" flexDirection="column" alignItems="center">
          <Text mb="8px" bold>
            <StyleText>No recent transactions</StyleText>
          </Text>
          <StyleButton>
            <Button variant="tertiary" size="sm" onClick={onDismiss}>
              Close
            </Button>
          </StyleButton>
        </Flex>
      )}
      {account &&
        chainId &&
        sortedRecentTransactions.map((sortedRecentTransaction) => {
          const { hash, summary } = sortedRecentTransaction
          const { icon } = getRowStatus(sortedRecentTransaction)

          return (
            <>
              <Flex key={hash} alignItems="center" justifyContent="space-between" mb="4px">
                <LinkExternalStyle href={getBscScanLink(chainId, hash, 'transaction')} >
                  {summary ?? hash}
                </LinkExternalStyle>
                {icon}
              </Flex>
            </>
          )
        })}
    </Modal>
  )
}

export default RecentTransactionsModal
