import React from 'react'
import { IocField as Props } from "../../api/index";
import { Error } from "@styled-icons/boxicons-regular"

const IocField = ({ parametr, info, dangerous }: Props) => {
  return (
    <div className="ioc-field">
        <span className="ioc-field-label">
          {parametr}
          {dangerous && <Error className="ioc-field-danger-icon" size="24"  />}
          </span>
          {info ? info : ""}
    </div>
  )
}

export default IocField
