import React from 'react';
import NavBar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import AlertPopup from '../Alerts/AlertPopup';

const Layout = ({ children }) => {
    return (
        <div className='flex flex-col h-screen'>
            <NavBar />
            <AlertPopup />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;