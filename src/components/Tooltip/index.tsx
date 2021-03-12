import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import Popover, { PopoverProps } from '../Popover'
import { lightColors } from '../../style/Color'

const TooltipContainer = styled.div`
  width: 228px;
  padding: 0.6rem 1rem;
  line-height: 150%;
  font-weight: normal;
  font-size: 12px;
  color: ${({ theme }) => (theme.isDark ? lightColors.background : lightColors.textMenuLeft)};
  ${({ theme }) => theme.mediaQueries.nav} {
    font-size: 14px;
  }
`

interface TooltipProps extends Omit<PopoverProps, 'content'> {
  text: string
}

export default function Tooltip({ text, ...rest }: TooltipProps) {
  return <Popover content={<TooltipContainer>{text}</TooltipContainer>} {...rest} />
}

export function MouseoverTooltip({ children, ...rest }: Omit<TooltipProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => setShow(true), [setShow])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <Tooltip {...rest} show={show}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  )
}
