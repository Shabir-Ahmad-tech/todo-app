import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer glass">
            <div className="container footer-content">
                <p className="footer-text">
                    Designed with <span className="heart">❤️</span> by
                    <a href="#" className="footer-name gradient-text">Shabir Ahmad</a>
                </p>
                <p className="copyright">© {currentYear} TodoFlow. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
