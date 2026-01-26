import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { routes } from "../../routes.js";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Verify = () => {
    const navigate = useNavigate();
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
   const verifyEmail = async () => {
  try {
    const res = await fetch(
      `${routes.verifyEmail}?token=${token}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await res.json();
    console.log("data is :::",data);

    if (data.success) {
      setStatus("success");
      setMessage(data.message || "Email verified successfully!");
      navigate("/complete-profile");
    } else {
      setStatus("error");
      setMessage(data.message || "Verification failed.");
    }
  } catch (err) {
    console.error(err);
    setStatus("error");
    setMessage("Something went wrong. Please try again.");
  }
};


    verifyEmail();
  }, [token]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {status === "loading" && <p>Verifying your email...</p>}

        {status === "success" && (
          <>
            <h2 style={{ color: "#16a34a" }}>✅ Email Verified</h2>
            <p>{message}</p>
            <a href="/login" style={styles.button}>
              Go to Login
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <h2 style={{ color: "#dc2626" }}>❌ Verification Failed</h2>
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f6f8",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  button: {
    display: "inline-block",
    marginTop: "20px",
    padding: "12px 24px",
    background: "#4f46e5",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "bold",
  },
};

export default Verify;
