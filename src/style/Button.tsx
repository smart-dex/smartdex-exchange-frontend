import { lightColors, baseColors } from 'style/Color'

export const Button = `
color: ${lightColors.background};
height: 45px;
font-size: 13px;
text-align: center;
line-height: 20px;
border-radius: 10px;
justify-content: center;
display: inline-flex;
justify-content: center;
align-items: center;
&:hover {
  text-decoration: none;
}
${({ theme }) => theme.mediaQueries.nav} {
  height: 56px;
  font-size: 16px;
}
`
export const ButtonPrimary = `
${Button}
box-shadow: 0px 4px 10px rgba(64, 170, 255, 0.24);
background-color: ${baseColors.primary};
`
export const ButtonSecondary = `
${Button}
box-shadow: 0px 4px 10px rgba(255, 161, 78, 0.24);
background-color: #FFA14E;
`
export const ButtonBorder = `
${Button}
background-color: ${lightColors.background};
color: ${baseColors.primary};
border: 1px solid ${baseColors.primary};
&:hover {
  background: ${baseColors.primary};
  border-color: ${baseColors.primary};
  text-decoration: none;
  color: ${lightColors.background};
}
`
export const ButtonGrey = `
${Button}
color: ${lightColors.fillSvg};
background: ${lightColors.backButtonGrey};
& svg {
  fill: ${lightColors.fillSvg};
}
`

export default Button;