import React from 'react'

function VerifyEmail() {
    const email=localStorage.getItem("userEmail");
    console.log(email);
    

  return (
    <div>
         <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Verify Your Email</h2>
            <p className="text-muted-foreground mb-6">
                A verification link has been sent to <span className="font-medium text-foreground">{email}</span>. Please check your inbox and click on the link to verify your email address.
            </p>
            <p className="text-sm text-muted-foreground">
                If you did not receive the email, please check your spam folder or <button className="text-primary font-medium underline">resend the verification email</button>.
            </p>
          
            {/* <div className="mt-6" onClick={}>
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded-lg font-medium transition-all transform active:scale-95 shadow-lg shadow-primary/20">
                    Back to Login
                </button>
            </div> */}
        </div>
        </div>
    </div>
  )
}

export default VerifyEmail
