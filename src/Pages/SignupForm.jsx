import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { User, Mail, Lock, Phone, Loader2, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { da } from 'date-fns/locale';


// --- Custom Input Component with Formik & Icons ---
const MyTextInput = ({ label, icon: Icon, ...props }) => {
  const [field, meta] = useField(props);
  // Determine border color: Error -> Red, Success (touched & valid) -> Green/Primary, Default -> Transparent
  const borderColor = meta.touched && meta.error 
    ? "border-red-500" 
    : meta.touched && !meta.error 
      ? "border-green-500/50" 
      : "border-transparent";

  return (
    <div className="space-y-1 mb-3">
      <label className="text-xs font-medium text-foreground ml-1">{label}</label>
      <div className="relative group">
        {/* Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
          <Icon className="w-4 h-4" />
        </div>
        
        {/* Input Field */}
        <input
          {...field}
          {...props}
          className={`w-full pl-10 pr-4 py-3 bg-secondary/50 border ${borderColor} focus:border-primary/50 focus:bg-background rounded-xl outline-none transition-all text-sm`}
        />

        {/* Success Indicator (Optional visual cue) */}
        {meta.touched && !meta.error && (
            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 opacity-50" />
        )}
      </div>

      {/* Error Message */}
      {meta.touched && meta.error ? (
        <div className="text-[10px] text-red-500 font-medium ml-1 animate-in slide-in-from-left-1">
          {meta.error}
        </div>
      ) : null}
    </div>
  );
};


export default function Signup() {
  

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  // Trigger Entrance Animation
  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // --- Validation Schema ---
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Full Name is Required")
      .min(3, "Name must be at least 3 characters")
      .max(25, "Name is too long"),
    email: Yup.string()
      .email("Invalid Email Address")
      .required("Email is Required"),
    phoneNumber: Yup.string()
      .matches(/^[6-9]\d{9}$/, "Invalid Indian Phone Number")
      .required("Phone Number is Required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 chars")
      .required("Password is Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden py-10">
      
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />

      <div className="w-full max-w-md relative z-10 px-6">
        
        {/* Cricket Ball Animation */}
        <div className="mb-8 flex justify-center relative h-24">
            <div className="animate-roll-in-right absolute left-1/2 -translate-x-1/2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-900 shadow-2xl relative border border-red-950 flex items-center justify-center overflow-hidden">
                    <div className="absolute w-[120%] h-full border-4 border-dotted border-white/80 rounded-full opacity-90 transform -rotate-45 scale-x-50"></div>
                    <div className="absolute top-2 left-3 w-4 h-4 bg-white/30 rounded-full blur-sm"></div>
                </div>
            </div>
        </div>

        {/* Form Container */}
        <div className={`transition-all duration-700 ease-out transform ${showForm ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-card border border-border/50 shadow-2xl rounded-2xl p-8 backdrop-blur-xl">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-yellow-500 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                Sign up to join the Cricket Box league
              </p>
            </div>

            <Formik
              initialValues={{
                name: "",
                email: "",
                phoneNumber: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  // Map Formik 'name' to API 'userName'
                  const payload = {
                    name: values.name,
                    email: values.email,
                    phoneNumber: values.phoneNumber,
                    password: values.password,
                    role: 'user', 
                  };

                   try {
                    const response = await axios.post('https://box-cricket-backend-v7vh.onrender.com/api/auth/signup', payload);
                    console.log("response",response);
                    const data = response.data; 
                     console.log("Signup Success:", data);
                     console.log("id",data?.data_id);
                     console.log("email",data?.data.email);
                  // Store Token
                  if (data.token) localStorage.setItem('UserCricBoxToken', data.token);
                  if (data.user?.name) localStorage.setItem('userName', data.user.name);
                  if(data?.data?._id) localStorage.setItem('UserId', data.data?._id);
                  if(data?.data?.email) localStorage.setItem('userEmail', data.data?.email);
                  toast.success("Account created successfully!");
                  toast.success("Please verify your email to continue.");
                  navigate("/login");
                  resetForm();
                    
                   } catch (error) {
                      console.log("api call error ",error);
                      const msg = error.response?.data?.message || "Signup failed. Please try again.";
                      toast.error(msg);
                   }
                    
    

                
                 
                  
                } catch (error) {
                  console.error("Signup Error:", error);
                  const msg = error.response?.data?.message || "Signup failed. Please try again.";
                  toast.error(msg);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-2">
                  <MyTextInput
                    label="Full Name"
                    name="name"
                    type="text"
                    placeholder="Virat Kohli"
                    icon={User}
                  />

                  <MyTextInput
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="player@example.com"
                    icon={Mail}
                  />

                  <MyTextInput
                    label="Phone Number"
                    name="phoneNumber"
                    type="tel"
                    placeholder="9876543210"
                    icon={Phone}
                  />

                  <MyTextInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                  />

                  <MyTextInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => {setTimeout(()=>{navigate("/verify-email")},2000)}}
                    className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 py-3 rounded-xl font-medium transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>Sign Up <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </Form>
              )}
            </Formik>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes roll-in-right {
          0% { transform: translateX(100vw) rotate(720deg); opacity: 0; }
          60% { transform: translateX(-20px) rotate(-20deg); opacity: 1; }
          80% { transform: translateX(10px) rotate(10deg); }
          100% { transform: translateX(0) rotate(0); opacity: 1; }
        }
        .animate-roll-in-right {
          animation: roll-in-right 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}