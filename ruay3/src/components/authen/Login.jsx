import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้ useNavigate
import Swal from 'sweetalert2';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  // สร้างฟังก์ชัน navigate

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loginData = {
            usernameOrEmail: identifier,
            password: password
        };

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data); // ตรวจสอบข้อมูลที่ได้จาก API
                
                // เก็บ token ลงใน localStorage
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('username', data.username);

                console.log('Token:', data.token);
                console.log('Username:', data.username);

                Swal.fire({
                    icon: 'success',
                    title: 'Login Successful',
                    text: 'Welcome!'
                }).then(() => {
                    navigate('/dashboard');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Invalid username or password',
                    confirmButtonText: 'Try Again'
                });
            }
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Please try again later.',
                confirmButtonText: 'OK'
            });
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center">Ruay Login</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="identifier">Username or Email:</label>
                                    <input
                                        type="text"
                                        id="identifier"
                                        className="form-control"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Password:</label>
                                    <input
                                        type="password"
                                        id="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-flex justify-content-center py-2">
                                    <button type="submit" className="btn btn-primary">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
