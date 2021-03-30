import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Flex, Input, Text } from 'uikit-sotatek'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { lightColors, baseColors } from 'style/Color'
import QuestionHelper from '../QuestionHelper'
import TranslatedText from '../TranslatedText'

const MAX_SLIPPAGE = 5000
const RISKY_SLIPPAGE_LOW = 50
const RISKY_SLIPPAGE_HIGH = 500

const StyledSlippageToleranceSettings = styled.div`
  margin-bottom: 16px;
`

const Option = styled.div`
  padding: 0 4px;
`

const Options = styled.div`
  align-items: left;
  display: flex;
  flex-direction: column;

  ${Option}:first-child {
    padding-left: 0;
  }

  ${Option}:last-child {
    padding-right: 0;
  }

  ${({ theme }) => theme.mediaQueries.nav} {
    flex-direction: row;
    align-items: center;
  }
`

const Label = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 8px;
`

const TextStyle = styled(Text)`
  color: ${({ theme }) => (theme.isDark ? lightColors.background : lightColors.textMenuLeft)};
  font-size: 13px;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
  }
`
const StyleButton = styled(Text)`
  button {
    font-size: 13px;
    ${({ theme }) => theme.mediaQueries.sm} {
      font-size: 16px;
    }
  }
`
const StyleInput = styled(Text)`
  input {
    font-size: 13px;
    color: ${({ theme }) => (theme.isDark ? lightColors.background : lightColors.textMenuLeft)};
    ${({ theme }) => theme.mediaQueries.sm} {
      font-size: 16px;
    }
  }
`

const ButtonStyle = styled(Button)`
  color: ${ baseColors.primary};
  font-size: 12px;
  padding: 0px 12px;
  height: 45px;
  margin-bottom: 12px;
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 16px;
    padding: 0 24px;
    height: 56px;
    margin-bottom: 0px;
  }
`

const predefinedValues = [
  { label: '0.1%', value: 0.1 },
  { label: '0.5%', value: 0.5 },
  { label: '1%', value: 1 }
]

const SlippageToleranceSettings = () => {
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  const [value, setValue] = useState(userSlippageTolerance / 100)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(parseFloat(inputValue))
  }

  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = value * 100
      if (!Number.isNaN(rawValue) && rawValue > 0 && rawValue < MAX_SLIPPAGE) {
        setUserslippageTolerance(rawValue)
        setError(null)
      } else {
        setError('Enter a valid slippage percentage')
      }
    } catch {
      setError('Enter a valid slippage percentage')
    }
  }, [value, setError, setUserslippageTolerance])

  // Notify user if slippage is risky
  useEffect(() => {
    if (userSlippageTolerance < RISKY_SLIPPAGE_LOW) {
      setError('Your transaction may fail')
    } else if (userSlippageTolerance > RISKY_SLIPPAGE_HIGH) {
      setError('Your transaction may be frontrun')
    }
  }, [userSlippageTolerance, setError])

  return (
    <StyledSlippageToleranceSettings>
      <Label>
        <TextStyle style={{ fontWeight: 600 }}>
          <TranslatedText translationId={88}>Slippage tolerance</TranslatedText>
        </TextStyle>
        <QuestionHelper text="Your transaction will revert if the price changes unfavorably by more than this percentage." />
      </Label>
      <Options>
        <Flex mb={['8px', 0]} mr={[0, '8px']}>
          {predefinedValues.map(({ label, value: predefinedValue }) => {
            const handleClick = () => setValue(predefinedValue)

            return (
              <Option key={predefinedValue}>
                <StyleButton>
                  <ButtonStyle variant={value === predefinedValue ? 'primary' : 'tertiary'} style={{ background: value === predefinedValue ? baseColors.primary : '', color: value === predefinedValue ? '#fff' : ''}} onClick={handleClick}>
                    {label}
                  </ButtonStyle>
                </StyleButton>
              </Option>
            )
          })}
        </Flex>
        <Flex alignItems="center">
          <Option>
            <StyleInput>
              <Input
                type="number"
                scale="lg"
                step={0.1}
                min={0.1}
                placeholder="5%"
                value={value}
                onChange={handleChange}
                isWarning={error !== null}
              />
            </StyleInput>
          </Option>
          <Option>
            <TextStyle>%</TextStyle>
          </Option>
        </Flex>
      </Options>
      {error && (
        <TextStyle mt="8px" color="failure">
          {error}
        </TextStyle>
      )}
    </StyledSlippageToleranceSettings>
  )
}

export default SlippageToleranceSettings
