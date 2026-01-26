import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from "yup"
import MyInput from '../component/formcomponent/MyInput'
import { routes } from "../../routes";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginForm() {

  const[formData,setFormData]=useState({
    email:'',
   password:''
  })

  const loadData=async()=>{
       const response=await axios.post(`${routes.login}`,{
      email:formData.email,
      password:formData.password,
    })
    console.log(response);
    console.log("token",response.data.token);
    console.log("userId",response.data.user._id);
    
    
    localStorage.setItem("UserCricBoxToken",response.data.token);
    localStorage.setItem("UserId",response.data.user._id);
       navigate("/")
    
  }
  useEffect(()=>{
    loadData();
   console.log("form useeffect",formData);
   
  },[formData])

  //  const dispatch = useDispatch();
   const navigate=useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={Yup.object({
          email: Yup.string().email("Invalid email address").required("Email is required"),
          password: Yup.string().min(8, "Minimum 8 characters").required("Password is required"),
        })}
        onSubmit={(values, { resetForm }) => {
          console.log(values)
          setFormData({
            email:values.email,
            password:values.password
          })
          console.log("values are ",values.email);
       

   
    
          resetForm()
        
          
        }}
      >
        <Form className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg space-y-5">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Login
          </h2>

          <MyInput label="Email" name="email" type="email" />
          <MyInput label="Password" name="password" type="password" />
           <p className='text-center  text-[#4a5568] text-base'>
            Don’t have an account?
            <a href="/"   className='text-[#667eea] font-semibold ml-4'>
              Sign up
            </a>
          </p>  
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  )
}

export default LoginForm
