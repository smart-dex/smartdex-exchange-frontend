import styled from 'styled-components'
import { lightColors, darkColors, baseColors } from 'style/Color'
import { AutoColumn } from '../Column'
import { RowBetween, RowFixed } from '../Row'

export const FadedSpan = styled(RowFixed)`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 14px;
`

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
`

export const MenuItem = styled(RowBetween)`
  padding: 4px 20px;
  height: 56px;
  display: grid;
  grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 67px);
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
  :hover {
    background-color: ${({ theme, disabled }) => !disabled && theme.colors.invertedContrast};
  }
  opacity: ${({ disabled, selected }) => (disabled || selected ? 0.5 : 1)};

  ${({ theme }) => theme.mediaQueries.nav} {
    grid-template-columns: auto minmax(auto, 1fr) auto minmax(0, 72px);
    grid-gap: 16px;
  }
`

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 20px;
  color: ${({ theme }) => theme.colors.text};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    color: ${({ theme }) => theme.colors.textDisabled};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`
export const SearchInputToken = styled.input`
  height: 60px;
  background: ${({theme}) => (theme.isDark ? darkColors.background : lightColors.background)};
  border-radius: 20px;
  font-size: 13px;

  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  border: none;
  outline: none;
  color: ${({theme}) => (theme.isDark ? darkColors.textLogoMenuLeft : lightColors.textMenuLeft)};
  border-style: solid;
  border: 1px solid ${({theme}) => (theme.isDark ? darkColors.background : lightColors.borderColor)};
  -webkit-appearance: none;

  ::placeholder {
    color: ${({theme}) => (theme.isDark ? darkColors.colorPla : lightColors.colorPla)};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${baseColors.primary};
    outline: none;
  }

  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 16px;
    height: 70px;
  }
`

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.invertedContrast};
`

export const SeparatorDark = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.tertiary};
`
