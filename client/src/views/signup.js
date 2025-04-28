import { useState } from "react";
import "../styles/signup.css";
import countryList from 'react-select-country-list';
import Select from 'react-select';

export default function SignupForm() {
    const [accountType, setAccountType] = useState("personal");
    const [country, setCountry] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        businessName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const options = countryList().getData();

    const handleCountryChange = (selectedOption) => {
        setCountry(selectedOption);
    };

    const handleToggle = (type) => setAccountType(type);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare data to send to the backend
        const dataToSend = {
            accountType,
            country: country.value, // Get the selected country value
            fullName: formData.fullName,
            businessName: formData.businessName,
            email: formData.email,
            username: formData.username,
            password: formData.password,
            confirmPassword: formData.confirmPassword
        };

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message); // Success message
            } else {
                alert(result.message); // Error message
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-left">
                <div className="signup-heading">
                    {accountType === "personal" ? "Create your personal account" : "Create your business account"}
                </div>
                <p className="signup-subtext">
                    Get access to BuyMe's online auctions — Buy, Bid, or Sell with ease.
                </p>
            </div>

            <div className="signup-right">
                <div className="signup-form">
                    <div className="signup-toggle">
                        <button
                            className={accountType === "personal" ? "toggle-btn active" : "toggle-btn"}
                            onClick={() => handleToggle("personal")}
                        >
                            Personal
                        </button>
                        <button
                            className={accountType === "business" ? "toggle-btn active" : "toggle-btn"}
                            onClick={() => handleToggle("business")}
                        >
                            Business
                        </button>
                    </div>

                    <form className="form-content" onSubmit={handleSubmit}>
                        {accountType === "personal" ? (
                            <>
                                <input
                                    name="fullName"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                />
                                <input
                                    name="email"
                                    placeholder="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <input
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                                <input
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <input
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <Select
                                    options={options}
                                    value={country}
                                    onChange={handleCountryChange}
                                    placeholder="Country"
                                    className="country-select"
                                />
                                <button className="submit-btn" type="submit">Create Personal Account</button>
                            </>
                        ) : (
                            <>
                                <input
                                    name="businessName"
                                    placeholder="Business Name"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                />
                                <input
                                    name="email"
                                    placeholder="Business Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                <input
                                    name="username"
                                    placeholder="Username"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                                <input
                                    name="password"
                                    placeholder="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <input
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <Select
                                    options={options}
                                    value={country}
                                    onChange={handleCountryChange}
                                    placeholder="Country"
                                    className="country-select"
                                />
                                <button className="submit-btn" type="submit">Create Business Account</button>
                            </>
                        )}
                    </form>

                    <p className="login-redirect">
                        Already have an account? <a href="/login">Sign In</a>
                    </p>
                </div>
            </div>
        </div>
    );
}