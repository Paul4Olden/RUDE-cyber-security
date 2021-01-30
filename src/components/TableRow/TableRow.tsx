import React from 'react'
import { Information } from "@styled-icons/remix-line"

interface Props {
  rowKey: string;
  children?: React.ReactNode;
  tooltip?: string;
}

const TableRow = ({ rowKey, children, tooltip }: Props) => {
  return (
    <tr className="table-row">
      <td className="table-row__key">
        <div>{rowKey}</div>
        {tooltip && <a className="table-row__key-info" href={tooltip}>
          <Information style={{margin: "auto"}} />
        </a>}
      </td>
      <td className="table-row__value">
        {children}
      </td>
    </tr>
  )
}

export default TableRow
