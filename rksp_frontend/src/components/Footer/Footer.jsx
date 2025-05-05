import './Footer.css';

function Footer(props) {
    return (
        <footer className='footer'>
            <p className='footer-text'>{props.text}</p>
        </footer>
    );
}

export default Footer;