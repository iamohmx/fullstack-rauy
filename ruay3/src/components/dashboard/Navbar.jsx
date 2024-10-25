import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Navbar = ({ name, role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        Swal.fire({
            icon: 'question',
            title: 'Log out',
            text: 'You want to log out?',
            confirmButtonText: 'Yes',
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                Swal.fire({
                    icon: 'success',
                    title: 'Logged out',
                    text: 'Log out successful',
                    showConfirmButton: false,
                    timer: 2000,
                }).then(() => {
                    navigate('/login');
                });
            }
        });
    };


    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link to="/dashboard" className="navbar-brand">Ruay3 Dashboard</Link>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link to="/dashboard" className="nav-link">Home</Link>
                            </li>
                            {/* User Management */}
                            <li className="nav-item ">
                                <Link to={'/customers'} className='nav-link'>
                                    Customers
                                </Link>
                            </li>
                            {/* End */}
                            
                            {/* Supplier Management */}
                            <li className="nav-item">
                                <Link to={'/suppliers'} className="nav-link">
                                    Suppliers
                                </Link>
                                
                            </li>
                            {/* End */}

                            {/* Invoice Management */}
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Invoice
                                </a>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link to="/order-goods" className="dropdown-item">Add Invoice</Link>
                                    </li>
                                    <li>
                                        <Link to="/order-list" className="dropdown-item">Invoice List</Link>
                                        {/* <a className="dropdown-item" href="#">Invoice List</a> */}
                                    </li>
                                </ul>
                            </li>
                            {/* End */}
                            
                            {/* Category Management */}
                            <li className="nav-item">
                                <Link to="/category" className="nav-link">Category</Link>
                            </li>

                        </ul>
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Hello, {name} <i className="bi bi-person-fill"></i>
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#"><i className="bi bi-feather"></i> Role : {role}</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

        </>
    );
};

export default Navbar;
