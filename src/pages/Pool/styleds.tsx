import { Text } from 'smartdex-uikit'
import styled from 'styled-components'
import { baseColors } from 'style/Color'

export const Wrapper = styled.div`
  position: relative;
  padding: 6px 4px 14px 4px;
  ${({ theme }) => theme.mediaQueries.nav} {
    padding: 10px 14px 18px 30px;
  }
`

export const ClickableText = styled(Text)`
  :hover {
    cursor: pointer;
  }
  color: ${baseColors.primary};
`

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`
