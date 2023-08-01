import styled from "styled-components";

const Button = styled.button<{
    $ml?: boolean
}>`
  outline: none;
  border: none;
  border-radius: 5px;
  padding: 4px 8px;
  font-size: 1.0em;
  background: #ceffff;
  cursor: pointer;
  margin-top: 4px;
  margin-bottom: 4px;
  
  &:hover {
    background: #aeffff;
  }
  
  ${({$ml}) => $ml && "margin-left: 48px"}
`

export default Button
