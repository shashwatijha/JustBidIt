import { useState } from "react";
import { useForm } from "react-hook-form";
import "../styles/signup.css";
import "../styles/login.css";
import countryList from 'react-select-country-list';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SignupForm() {
    const [accountType, setAccountType] = useState("personal");
    const [country, setCountry] = useState(null);

    const options = countryList().getData();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, touchedFields }
    } = useForm({
        mode: 'onChange',
    });

    const password = watch("password");

    const isPasswordStrong = (val) =>
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(val);

    const onSubmit = async (formData) => {
        const dataToSend = {
            accountType,
            country: country?.value || "",
            ...formData
        };

        try {
            const response = await fetch('/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            const result = await response.json();
            if (response.ok) {
                toast.success("User registered successfully");
                reset();
                setCountry(null);
            } else {
                toast.error(result.message || "Registration failed");
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const renderField = (label, name, type = "text") => (
        <>
            <input
                name={name}
                type={type}
                placeholder={label}
                className={
                    touchedFields[name]
                        ? errors[name]
                            ? "input-error"
                            : "input-valid"
                        : ""
                }
                {...register(name, {
                    required: `${label} is required`,
                })}
            />
            {errors[name] && <p className="input-hint">{errors[name].message}</p>}
        </>
    );

    return (
        <div className="signup-container">
            <div className="signup-left">
                <div className="signup-heading">
                    {accountType === "personal" ? "Create your personal account" : "Create your business account"}
                </div>
                <p className="signup-subtext">
                    Get access to JustBIDit's online auctions — Buy, Bid, or Sell with ease.
                </p>
            </div>

            <div className="signup-right">
                <div className="signup-form">
                    <div className="signup-toggle">
                        <button
                            className={accountType === "personal" ? "toggle-btn active" : "toggle-btn"}
                            onClick={() => setAccountType("personal")}
                        >
                            Personal
                        </button>
                        <button
                            className={accountType === "business" ? "toggle-btn active" : "toggle-btn"}
                            onClick={() => setAccountType("business")}
                        >
                            Business
                        </button>
                    </div>

                    <form className="form-content" onSubmit={handleSubmit(onSubmit)}>
                        {accountType === "personal" ? (
                            <>
                                {renderField("Full Name", "fullName")}
                                {renderField("Email Address", "email", "email")}
                            </>
                        ) : (
                            <>
                                {renderField("Business Name", "businessName")}
                                {renderField("Business Email", "email", "email")}
                            </>
                        )}
                        {renderField("Username", "username")}
                        <input
                            name="password"
                            type="password"
                            placeholder="Password"
                            className={
                                touchedFields.password
                                    ? errors.password
                                        ? "input-error"
                                        : "input-valid"
                                    : ""
                            }
                            {...register("password", {
                                required: "Password is required",
                                validate: (val) =>
                                    isPasswordStrong(val) ||
                                    "Must be 8+ characters, incl. letter, number & symbol"
                            })}
                        />
                        {errors.password && (
                            <p className="input-hint">{errors.password.message}</p>
                        )}

                        <input
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            className={
                                touchedFields.confirmPassword
                                    ? errors.confirmPassword
                                        ? "input-error"
                                        : "input-valid"
                                    : ""
                            }
                            {...register("confirmPassword", {
                                required: "Please confirm password",
                                validate: (val) =>
                                    val === password && isPasswordStrong(password) ||
                                    "Passwords must match and meet strength rules"
                            })}
                        />
                        {errors.confirmPassword && (
                            <p className="input-hint">{errors.confirmPassword.message}</p>
                        )}

                        <Select
                            options={options}
                            value={country}
                            onChange={(selectedOption) => setCountry(selectedOption)}
                            placeholder="Country"
                            className="country-select"
                        />

                        <button className="submit-btn" type="submit">
                            {accountType === "personal" ? "Create Personal Account" : "Create Business Account"}
                        </button>
                    </form>

                    <div className="divider" />
                    <div className="loginsignup-container">
                        <p className="signup-text">
                            Already have an account? <a href="/login" className="create-link">Sign In</a>
                        </p>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}
