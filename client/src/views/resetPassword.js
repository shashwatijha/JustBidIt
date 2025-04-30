import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import '../styles/login.css'; // IKEA styles

const isPasswordStrong = (password) => {
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
};

function ResetPassword() {
  const [token, setToken] = useState('');
  const [serverMsg, setServerMsg] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const t = urlParams.get('token');
    if (t) setToken(t);
    else setServerMsg("Missing token.");
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields }
  } = useForm({
    mode: 'onChange', // or 'onBlur'
  });
  const onSubmit = async (data) => {
    if (!token) return;

    try {
      const res = await fetch('/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: data.password }),
      });

      const result = await res.json();
      setServerMsg(result.message);
    } catch (err) {
      console.error(err);
      setServerMsg("Server error");
    }
  };

  const password = watch("password");

  return (
    <div className="login-container">
      <div className="login-left">
        <h1><span className="highlight">Set</span> a new password</h1>
        <p>Choose a strong password to keep your account secure.</p>
      </div>

      <div className="login-right">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2 style={{ marginBottom: '1rem' }}>Reset Password</h2>

          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            className={
              touchedFields.password
                ? errors.password
                  ? 'input-error'
                  : 'input-valid'
                : ''
            }
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Must be at least 8 characters" },
              validate: (val) =>
                /[A-Za-z]/.test(val) &&
                /\d/.test(val) &&
                /[@$!%*?&]/.test(val) ||
                "Must include a letter, number, and special character"
            })}
          />
          {errors.password && (
            <p className="input-hint">{errors.password.message}</p>
          )}

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter new password"
            className={
              touchedFields.confirm
                ? errors.confirm
                  ? 'input-error'
                  : 'input-valid'
                : ''
            }
            {...register("confirm", {
              required: "Please confirm your password",
              validate: (val) => {
                if (val !== password) return "Passwords do not match";
                if (!isPasswordStrong(password)) return "Password is not strong enough";
                return true;
              }
            })}
          />
          {errors.confirm && (
            <p className="input-hint">{errors.confirm.message}</p>
          )}

          <button type="submit" className="login-button">Reset Password</button>

          {serverMsg && (
            <p style={{ marginTop: '1rem', fontWeight: '500', color: '#333' }}>
              {serverMsg}
            </p>
          )}

          <div className="divider" />
          <div className="loginsignup-container">
            <p className="signup-text">
              <a href="/login" className="create-link">Back to Sign In</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
