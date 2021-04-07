import React from 'react'
import styled from 'styled-components'
import NumberFormat from 'react-number-format';
import { lightColors, darkColors } from 'style/Color'
import { escapeRegExp } from '../../utils'

const StyledInput = styled.div<{ error?: boolean; fontSize?: string; align?: string }>`
  width: 0px;
  flex: 1 1 auto;
  input {
    width: 100%;
    color: ${({ error, theme }) => (error ? theme.colors.failure : theme.colors.text)};
    position: relative;
    font-weight: 500;
    outline: none;
    border: none;
    flex: 1 1 auto;
    background-color: transparent;
    font-size: 16px;
    text-align: ${({ align }) => align && align};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0px;
    -webkit-appearance: textfield;

    ::-webkit-search-decoration {
      -webkit-appearance: none;
    }

    [type='number'] {
      -moz-appearance: textfield;
    }

    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }

    ::placeholder {
      color: ${({ theme }) => (theme.isDark ? darkColors.fontPlaceholder : lightColors.fontPlaceholder)};
      font-size: 12px;
      ${({ theme }) => theme.mediaQueries.nav} {
        font-size: 16px;
      }
    }
  }
`

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group

export const Input = React.memo(function InnerInput({
  value,
  onUserInput,
  placeholder,
  ...rest
}: {
  value: string | number
  onUserInput: (input: string) => void
  error?: boolean
  fontSize?: string
  align?: 'right' | 'left'
} & Omit<React.HTMLProps<HTMLInputElement>, 'ref' | 'onChange' | 'as'>) {
  const enforcer = (nextUserInput: string) => {
    if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
      onUserInput(nextUserInput)
    }
  }

  return (
    <StyledInput>
      <NumberFormat
        className="token-amount-input"
        value={value}
        onChange={(event) => {
          // replace commas with periods, because uniswap exclusively uses period as the decimal separator
          enforcer(event.target.value.replace(/,/g, ''))
        }}
        // universal input options
        inputMode="decimal"
        title="Token Amount"
        autoComplete="off"
        autoCorrect="off"
        // text-specific options
        type="text"
        placeholder={placeholder || '0.0'}
        spellCheck="false"

        thousandSeparator=","
        allowNegative={false}
        decimalScale={8}
        isAllowed={(values) => {
          const {floatValue} = values;
          if (value >= 10000000000000000 && String(floatValue).length < String(value).length) {
            return true
          }
          if (floatValue && floatValue >= 10000000000000000) {
            return false;
          }
          return true;
        }}
      />
    </StyledInput>
  )
})

export default Input
