import React from 'react'

type ButtonType = "purple";
type Type = "button" | "submit" | "reset";
interface Props {
  children: React.ReactNode;
  buttonType?: ButtonType;
  disabled?: boolean;
  onClick?: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined;
  className?: string;
  type?: Type;
}

const Button = ({ children,
  disabled,
  onClick,
  className,
  type = "button",
  buttonType = "purple"
}: Props) => {
  return (
    <button onClick={onClick}
      disabled={disabled}
      className={`button button_${buttonType} ${className ? className : ""}`}
      type={type}>
      {children}
    </button>
  )
}

export default Button
