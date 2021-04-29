import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { lightColors, darkColors } from 'style/Color'
import { Input, Text } from 'smartdex-uikit'
import NumberFormat from 'react-number-format';
import { useUserDeadline } from 'state/user/hooks'
import { TranslateString } from 'utils/translateTextHelpers'
import QuestionHelper from '../QuestionHelper'

const StyledTransactionDeadlineSetting = styled.div`
  margin-bottom: 16px;
`

const Label = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 8px;
`

const Field = styled.div`
  align-items: center;
  display: inline-flex;

  & > ${Input} {
    max-width: 100px;
  }

  & > ${Text} {
    margin-left: 8px;
  }
`
const TextStyle = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? lightColors.background : lightColors.textMenuLeft)};
  font-size: 13px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
  }
`

const StyleInput = styled(Text)`
  margin-left: 0px !important;
  input {
    height: 48px;
    font-size: 13px;
    color: ${({ theme }) => (theme.isDark ? lightColors.background : lightColors.textMenuLeft)};
    ${({ theme }) => theme.mediaQueries.sm} {
      font-size: 16px;
    }

    background-color: ${({ theme }) => (theme.isDark ? darkColors.backInputPercent : lightColors.backInputPercent)};
    border: 0px;
    border-radius: 16px;
    display: block;
    height: 48px;
    outline: 0px;
    padding: 0px 16px;
    width: 100%;
  }
`

const TransactionDeadlineSetting = () => {
  const [deadline, setDeadline] = useUserDeadline()
  const [value, setValue] = useState(deadline / 60) // deadline in minutes
  const [error, setError] = useState<string | null>(null)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(parseInt(inputValue, 10))
  }

  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = value * 60
      if (!Number.isNaN(rawValue) && rawValue > 0) {
        setDeadline(rawValue)
        setError(null)
      } else {
        setError('Enter a valid deadline')
      }
    } catch {
      setError('Enter a valid deadline')
    }
  }, [value, setError, setDeadline])

  return (
    <StyledTransactionDeadlineSetting>
      <Label>
        <TextStyle style={{ fontWeight: 600 }}>
          {TranslateString(90, "Transaction deadline")}
        </TextStyle>
        <QuestionHelper text={TranslateString(188, "Your transaction will revert if it is pending for more than this long")} />
      </Label>
      <Field>
        <StyleInput>
          <NumberFormat
            min={1}
            value={value}
            onChange={handleChange}
            thousandSeparator=""
            allowNegative={false}
            decimalScale={0}
          />
        </StyleInput>
        <TextStyle>{TranslateString(1205, "Minutes")}</TextStyle>
      </Field>
      {error && (
        <TextStyle mt="8px" color="failure">
          {error === 'Enter a valid deadline' ? TranslateString(1150, 'Enter a valid deadline') : error}
        </TextStyle>
      )}
    </StyledTransactionDeadlineSetting>
  )
}

export default TransactionDeadlineSetting
