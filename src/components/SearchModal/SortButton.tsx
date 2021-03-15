import React from 'react'
import { Text } from 'uikit-sotatek'
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

export default function SortButton({
  toggleSortOrder,
  ascending
}: {
  toggleSortOrder: () => void
  ascending: boolean
}) {
  return (
    <FilterWrapper onClick={toggleSortOrder}>
      <Text fontSize="14px">{ascending ? '↑' : '↓'}</Text>
    </FilterWrapper>
  )
}
