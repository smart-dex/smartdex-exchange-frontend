import React, { useMemo } from 'react'
import styled from 'styled-components'
import { baseColors, darkColors, lightColors } from 'style/Color'
import { CheckmarkCircleIcon, ErrorIcon, Flex, LinkExternal, Text, Modal, Button } from 'smartdex-uikit'
import { useActiveWeb3React } from 'hooks'
import { getBscScanLink } from 'utils'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { TransactionDetails } from 'state/transactions/reducer'
import Loader from 'components/Loader'
import { TranslateString } from 'utils/translateTextHelpers'

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
    
    return txs.filter(isTransactionRecent).sort(newTransactionsFirst).filter((item) => item.from === account)
  }, [allTransactions, account])

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
      fill: #0085ff;
    }
  `

  return (
    <Modal title={TranslateString(1207, 'Recent Transactions')} onDismiss={onDismiss}>
      {!account && (
        <Flex justifyContent="center" flexDirection="column" alignItems="center">
          <Text mb="8px" bold>
            <StyleText>
              {TranslateString(1209, 'Please connect your wallet to view your recent transactions')}
            </StyleText>
          </Text>
          <StyleButton>
            <Button variant="tertiary" size="sm" onClick={onDismiss}>
              {TranslateString(438, 'Close')}
            </Button>
          </StyleButton>
        </Flex>
      )}
      {account && chainId && sortedRecentTransactions.length === 0 && (
        <Flex justifyContent="center" flexDirection="column" alignItems="center">
          <Text mb="8px" bold>
            <StyleText>{TranslateString(1211, 'No recent transactions')}</StyleText>
          </Text>
          <StyleButton>
            <Button variant="tertiary" size="sm" onClick={onDismiss}>
              {TranslateString(438, 'Close')}
            </Button>
          </StyleButton>
        </Flex>
      )}
      {account &&
        chainId &&
        sortedRecentTransactions.map((sortedRecentTransaction) => {
          const { hash, summary } = sortedRecentTransaction
          const { icon } = getRowStatus(sortedRecentTransaction)
          let translateSummary
          const addText = summary?.includes('Add')
          const removeText = summary?.includes('Remove')
          const swapText = summary?.includes('Swap')
          const approveText = summary?.includes('Approve')

          if(addText){
            translateSummary = summary?.replace("Add", TranslateString(258, "Add"))
          }
          else if(removeText) {
            translateSummary = summary?.replace("Remove", TranslateString(260, "Remove"))
          } else if(approveText) {
            translateSummary = summary?.replace("Approve", TranslateString(564, "Approve"))
          }
          else translateSummary = summary?.replace("Swap", TranslateString(1142, "Swap"))

          const resultTranslateSummary =  swapText ? translateSummary.replace("for",TranslateString(1238, "for")) : translateSummary.replace("and",TranslateString(1230, "and"))
         
          return (
            <>
              <Flex key={hash} alignItems="center" justifyContent="space-between" mb="4px">
                <LinkExternalStyle href={getBscScanLink(chainId, hash, 'transaction')}>
                  {resultTranslateSummary ?? hash}
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
