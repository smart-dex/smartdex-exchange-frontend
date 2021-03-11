import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Tooltip from '../Tooltip'
import { lightColors } from '../../style/Color'

const QuestionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem;
  border: none;
  background: none;
  outline: none;
  cursor: default;
  border-radius: 36px;
  color: ${({ theme }) => (theme.isDark ? lightColors.background : lightColors.textMenuLeft)}

  :hover,
  :focus {
    opacity: 0.7;
  }
`

const IconQuestion = styled.div`
  width: 5.08px;
  height: 8.42px;
  background-image: url('/images/question-mobile-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.svg');
  margin: 3px 5px;
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 9px;
    height: 14px;
    background-image: url('/images/question-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.svg');
    margin: 5px 7px;
  }
`

const BorderQuestion = styled.div`
  width: 15px;
  height: 15px;
  background-image: url('/images/border-mobile-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.svg');
  background-repeat: no-repeat;
  background-position: center;
  ${({ theme }) => theme.mediaQueries.nav} {
    width: 24px;
    height: 24px;
    background-image: url('/images/border-${({ theme }) => (theme.isDark ? 'dark' : 'light')}.svg');
  }
`

export default function QuestionHelper({ text }: { text: string }) {
  const [show, setShow] = useState<boolean>(false)

  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])

  return (
    <span style={{ marginLeft: 4 }}>
      <Tooltip text={text} show={show}>
        <QuestionWrapper onClick={open} onMouseEnter={open} onMouseLeave={close}>
          <BorderQuestion>
            <IconQuestion />
          </BorderQuestion>
        </QuestionWrapper>
      </Tooltip>
    </span>
  )
}
