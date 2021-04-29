import React from 'react'
import { Text } from 'smartdex-uikit'
import styled from 'styled-components'
import { lightColors, darkColors } from 'style/Color'
import { RowFixed } from '../Row'

export const FilterWrapper = styled(RowFixed)`
  padding: 0px 8px;
  color: ${({ theme }) => (theme.isDark ? darkColors.textSubtle : lightColors.titleMini)};
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
  }
  div {
    font-size: 30px;
  }
  ${({ theme }) => theme.mediaQueries.nav} {
    div {
      font-size: 35px;
    }
  }
`
const TextStyle = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
`
export default function SortButton({
  toggleSortOrder,
  ascending,
}: {
  toggleSortOrder: () => void
  ascending: boolean
}) {
  return (
    <FilterWrapper onClick={toggleSortOrder}>
      <TextStyle fontSize="14px">{ascending ? '↑' : '↓'}</TextStyle>
    </FilterWrapper>
  )
}
