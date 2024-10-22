import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ใช้ useNavigate
import Swal from 'sweetalert2';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  // สร้างฟังก์ชัน navigate

    useEffect(() => {
        // Check if the user is already logged in
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
            navigate('/dashboard');
        }
    }, [navigate]);

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
                console.log('Login successful:', data);
    
                // ตรวจสอบว่ามี jwt และข้อมูล user ในการตอบกลับ
                if (data.jwt && data.user) {
                    const token = data.jwt;
                    const username = data.user.username;
                    const name = data.user.name;
                    const role = data.user.roles[0].name; // สมมติว่า roles ส่งมาเป็น array
    
                    // เก็บข้อมูลลงใน localStorage
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('username', username);
                    localStorage.setItem('role', role);
                    localStorage.setItem('name', name);
    
                    console.log('Token:', token);
                    console.log('Username:', username);
                    console.log('Name:', name);
                    console.log('Role:', role);
    
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'Welcome : ' + username + '!',
                        showConfirmButton: false,
                        timer: 2000,
                    }).then(() => {
                        // เปลี่ยนเส้นทางไปยังหน้า Dashboard หลังจากการล็อกอินสำเร็จ
                        navigate('/dashboard');
                    });
                } else {
                    console.error('Missing JWT or user data in response');
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'Missing JWT or user data in response',
                        confirmButtonText: 'Try Again'
                    });
                }
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
