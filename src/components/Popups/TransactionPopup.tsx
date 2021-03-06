import React, { useContext } from 'react'
import { AlertCircle, CheckCircle } from 'react-feather'
import { darkColors, lightColors, baseColors} from 'style/Color'
import { Text } from 'smartdex-uikit'
import styled, { ThemeContext } from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { getBscScanLink } from '../../utils'
import { ExternalLink } from '../Shared'
import { AutoColumn } from '../Column'
import { AutoRow } from '../Row'

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`

const TextStyle = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
`

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string
  success?: boolean
  summary?: string
}) {
  const { chainId } = useActiveWeb3React()

  const theme = useContext(ThemeContext)

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? (
          <CheckCircle color={baseColors.primary} size={24} />
        ) : (
          <AlertCircle color={theme.colors.failure} size={24} />
        )}
      </div>
      <AutoColumn gap="8px">
        <TextStyle>{summary ?? `Hash: ${hash.slice(0, 8)}...${hash.slice(58, 65)}`}</TextStyle>
        {chainId && <ExternalLink href={getBscScanLink(chainId, hash, 'transaction')} style={{ color: baseColors.primary}}>View on bscscan</ExternalLink>}
      </AutoColumn>
    </RowNoFlex>
  )
}
