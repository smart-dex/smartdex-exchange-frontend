import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { lightColors } from 'style/Color'
import { Input, Text } from 'uikit-sotatek'
import { useUserDeadline } from 'state/user/hooks'
import QuestionHelper from '../QuestionHelper'
import TranslatedText from '../TranslatedText'

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
  input {
    height: 48px;
    font-size: 13px;
    color: ${({ theme }) => (theme.isDark ? lightColors.background : lightColors.textMenuLeft)};
    ${({ theme }) => theme.mediaQueries.sm} {
      font-size: 16px;
    }
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
          <TranslatedText translationId={90}>Transaction deadline</TranslatedText>
        </TextStyle>
        <QuestionHelper text="Your transaction will revert if it is pending for more than this long." />
      </Label>
      <Field>
        <StyleInput><Input type="number" step="1" min="1" value={value} onChange={handleChange} /></StyleInput>
        <TextStyle>Minutes</TextStyle>
      </Field>
      {error && (
        <TextStyle mt="8px" color="failure">
          {error}
        </TextStyle>
      )}
    </StyledTransactionDeadlineSetting>
  )
}

export default TransactionDeadlineSetting
