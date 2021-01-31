import React from 'react'
import { Ioc as IocProps} from "../../api/"
import IocField from "../IocField/IocField";


const Ioc = (props: IocProps) => {
  return (
    <div>
      {Object.keys(props).map((
        ioc, index
      ) => {
        return <React.Fragment key={ioc}>
          {
            Array.from(props[ioc]).map(
              (IocFieldProps, index) => <IocField {...IocFieldProps} parametr={ioc} key={index}/>
            )
          }
        </React.Fragment>
      })}
    </div>
  )
}

export default Ioc
