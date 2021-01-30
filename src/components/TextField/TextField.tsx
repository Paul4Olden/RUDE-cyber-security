import React from 'react'

interface Props {
  value: string;
  onChange: ((event: React.ChangeEvent<HTMLTextAreaElement>) => void) | undefined;
  label?: string;
  className?: string;
}

const TextField = ({ label, className, value, onChange }: Props) => {
  return (
    <div className={`text-field ${className ? className : ""}`}>
      <label className="text-field__label">{label}</label>
      <textarea rows={4} value={value} onChange={onChange} className="text-field__input" />
    </div>
  )
}

export default TextField
