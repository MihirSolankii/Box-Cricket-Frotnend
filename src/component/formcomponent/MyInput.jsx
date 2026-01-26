import React from 'react'
import { Formik,Form,useField ,ErrorMessage} from 'formik'
function MyInput({label,...props}) {

    const[field,meta]=useField(props)
  return (
    <div>
      <label htmlFor={props.id || props.name}   className="block text-sm font-medium text-gray-700 mb-1" >{label}</label>
      <input   {...field} {...props}   className="w-full px-3 py-2 border border-gray-300 rounded-lg
             focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      <br/>
    <ErrorMessage
  name={props.name}
  component="div"
  className="text-red-500 text-base mt-1"
/>
    </div>
  )
}

export default MyInput
