import React from 'react'
import { Link } from "react-router-dom"

interface Props {

}

const Header = (props: Props) => {
  return (
    <header className="header unselectable">
      <Link to="/" className="brand">
        RuDe <span className="brand-app-name">SecurityTinder</span>
      </Link>
    </header>
  )
}

export default Header;