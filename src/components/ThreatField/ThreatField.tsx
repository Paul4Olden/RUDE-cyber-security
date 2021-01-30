import React from 'react'
import { ThreatFiled } from "../../api/index";

const ThreatField = ({ parametr, info }: ThreatFiled) => {
  return (
    <div className="threat-field">
      {parametr && <div className="threat-field__parametr">
        <span className="threat-field__parametr-label">Угроза </span>
        {parametr}
      </div>}
      {info &&
        <div className="threat-field__info">
          <span className="threat-field__info-label">Источник </span>
          {info}
        </div>}
    </div>
  )
}

export default ThreatField
