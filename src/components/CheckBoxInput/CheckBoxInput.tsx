import React from 'react'
import { Checkbox } from "@styled-icons/boxicons-regular";
import { CheckboxChecked } from "@styled-icons/boxicons-solid/";

interface Props {
  inputId: string;
  onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
  checked: boolean;
  label: string;
}

const CheckBoxInput = ({ inputId, onChange, checked, label }: Props) => {
  return (
    <>
      <label className="checkbox-input__label" htmlFor={inputId} >
        <div className="checkbox-input__circle-icon">
          {checked ? <CheckboxChecked size="24" /> : <Checkbox size="24" />}
        </div>
        {label}
      </label>
      <input type="checkbox" id={inputId} className="checkbox-input" onChange={onChange} />
    </>
  )
}

export default CheckBoxInput
