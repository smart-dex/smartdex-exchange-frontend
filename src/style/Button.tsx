
export const SelectButtonStyle = `
& a {
  color: #5F5E76;
  height: 45px;
  font-size: 13px;
  padding: 0 20px;
  
  background: none;
  line-height: 20px;
  border-radius: 50px;
  &:hover {
    background: none;
  }
  &:focus {
    box-shadow: 'none',
  }
  &.bSLFEh {
    background: #0085FF;
    color: #fff;
    font-weight: 600;
    &:hover {
      background: #0085FF !important;
    }
    &:focus: {
      boxShadow: none;
    }
  }
  &.gGdvQK {
    background: #0085FF;
    color: #fff;
    font-weight: 600;
    &:hover {
      background: #0085FF !important;
    }
    &:focus: {
      boxShadow: none;
    }
  }
}  
&>div {
  background: #E9F4FC;
  border-radius: 50px;
}
@media(min-width: 768px) {
  & a {
    height: 56px;
    padding: 0 35px;
    font-size: 16px;
    font-weight: normal;
  }
}
`
export const Button = `
color: #fff;
height: 56px;
font-size: 16px;
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
@media(max-width: 767px) {
  height: 45px;
  font-size: 13px;
}
`
export const ButtonPrimary = `
${Button}
box-shadow: 0px 4px 10px rgba(64, 170, 255, 0.24);
background-color: #0085FF;
`
export const ButtonSecondary = `
${Button}
box-shadow: 0px 4px 10px rgba(255, 161, 78, 0.24);
background-color: #FFA14E;
`
export const ButtonBorder = `
${Button}
background-color: #fff;
color: #0085FF;
border: 1px solid #0085FF;
&:hover {
  background: #0085FF !important;
  border-color: #0085FF !important;
  text-decoration: none;
  color: #fff;
}
`
export const ButtonGrey = `
${Button}
color: #8F8FA0;
background: #E8E8EB;
& svg {
  fill: #8F8FA0;
}
`

export default SelectButtonStyle;