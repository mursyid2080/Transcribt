import { Link } from 'react-router-dom'

const NavBar = ({show}) => {
    return(
        <div className={show ? "sidenav active" : "sidenav"}>
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/transcribe">Auto-transcribe</Link>
                </li>
                <li>
                    <Link to="/editor">Editor</Link>
                </li>
            </ul>
        </div>
    )

}

export default NavBar