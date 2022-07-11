import React from 'react'
import styled, { css } from 'styled-components'
import TrashIcon from '@rsuite/icons/Trash';
import CopyIcon from '@rsuite/icons/Copy';

import { COLORS } from '../../constants/constants'

import { ReactComponent as EditIconSVG } from '../icons/Bouton_edition.svg'

const Button = ({color, background, ...props}) => {
  return (<button type={"button"} {...props}></button>)
}

const BaseButton = styled(Button)`
  background: ${props => props.background};
  color: ${props => props.color};
  font-size: 13px;
  padding: 5px 12px;
  margin: 2px;
  height: 30px;
`

const basePrimaryButtonCSS = css`
  background: ${COLORS.charcoal};
  color: ${COLORS.gainsboro};
  ${props => props.width ? `width: ${props.width};` : ''}
  :hover, :focus {
    background: ${COLORS.charcoal};
  }
  :disabled {
    border: 1px solid ${COLORS.lightGray};
    background: ${COLORS.lightGray};
    color: ${COLORS.white};
  }
`

const baseSecondaryButtonCSS = css`
  border: 1px solid ${COLORS.charcoal};
  color: ${COLORS.gunMetal};
  ${props => props.width ? `width: ${props.width};` : ''}
  :disabled {
    border: 1px solid ${COLORS.lightGray};
    color: ${COLORS.slateGray};
  }
`


export const PrimaryButton = styled(BaseButton)`
  ${basePrimaryButtonCSS}
`

export const SecondaryButton = styled(BaseButton)`
  ${baseSecondaryButtonCSS}
`

export const ValidateButton = styled(PrimaryButton)`
  margin: 0px 10px 0px 0px;
`

export const CancelButton = styled(SecondaryButton)`
  margin: 0px 10px 0px 0px;
`



const EditIcon = styled(EditIconSVG)`
  padding-right: 8px;
`
const EditButtonWrapper = styled.button`
  background: ${COLORS.charcoal};
  color: ${COLORS.white};
  display: flex;
  align-items: center;
  height: 24px;
  padding: 8px;
  cursor: pointer;
  &:hover {
    background: ${COLORS.gunMetal};
  }
`

export const EditButton = (props) => {
  return (<EditButtonWrapper {...props}>
    <EditIcon/>Editer
  </EditButtonWrapper>)
}

export const DeleteButton = ({buttonStyle, ...props}) => {
  return <button type="button" {...props}><TrashIcon style={{color: 'red', ...buttonStyle}} /></button>
}

export const DuplicateButton = (props) => {
  return (<button type="button" {...props}><CopyIcon /></button>)
}