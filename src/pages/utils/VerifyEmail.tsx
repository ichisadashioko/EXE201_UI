import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

export async function api_verify_user(
  // access_token: string,
  // new_name: string
  token: string,
) {
  try {
    // /api/users/resend-verification
    // /api/users/verify_email
    // /api/users/verify
    const response = await fetch(`/api/users/verify`, {
      method: "POST",
      headers: {
        // Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: token }),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data: data };
    } else {
      return {
        success: false,
        message: data.message || "failed to verify user",
      };
    }
  } catch (error) {
    console.error("API call failed: api_verify_user", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}


export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email, please wait...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No verification token found. Please check the link and try again.');
      return;
    }

    const verify = async () => {
      const result = await api_verify_user(token);
      if (result.success) {
        setStatus('success');
        setMessage(result.data.message);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    };

    verify();
  }, [searchParams]); // Effect runs when the component mounts or URL params change

  const renderContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="alert alert-success text-center">
            <h4 className="alert-heading">Verification Successful!</h4>
            <p>{message}</p>
            <hr />
            <Link to="/login" className="btn btn-primary">
              Proceed to Login
            </Link>
          </div>
        );
      case 'error':
        return (
          <div className="alert alert-danger text-center">
            <h4 className="alert-heading">Verification Failed</h4>
            <p>{message}</p>
            <p>You may need to request a new verification link.</p>
          </div>
        );
      case 'verifying':
      default:
        return (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-3">{message}</span>
          </div>
        );
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-4 shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
        {renderContent()}
      </div>
    </div>
  );
}
