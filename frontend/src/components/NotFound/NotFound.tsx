import { Link } from "react-router-dom";

interface Props {  
}

const NotFound = (props: Props) => {
    return (
        <div className="not-found">
            <div className="not-found__wrapper  unselectable">
                <div className="not-found__wrapper__inner">
                <label className="not-found__wrapper__inner__label-404">404</label>
                <label className="not-found__wrapper__inner__label-main">Страница не найдена</label>
                <div>
                  <label className="not-found__wrapper__inner__label-sub">вернуться на</label>
                  <Link to="/" className="not-found__wrapper__inner__label-link">главную страницу</Link>
                </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound
