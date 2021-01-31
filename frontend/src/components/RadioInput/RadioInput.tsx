import React from 'react'
import { RadioCircle } from "@styled-icons/boxicons-regular";
import { RadioCircleMarked } from "@styled-icons/boxicons-regular/RadioCircleMarked";

interface Props {
  inputId: string;
  name: string;
  value: string;
  onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
  checked: boolean;
  label: string;
}

const RadioInput = ({ inputId, name, value, onChange, checked, label }: Props) => {
  return (
    <>
      <label className="radio-input__label" htmlFor={inputId} >
        <div className="radio-input__circle-icon">
          {checked ? <RadioCircleMarked size="24" /> : <RadioCircle size="24" />}
        </div>
        {label}
      </label>
      <input type="radio" name={name} value={value} id={inputId} className="radio-input" onChange={onChange} />
    </>
  )
}

export default RadioInput
