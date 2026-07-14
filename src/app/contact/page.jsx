"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRoot } from "@/services/api";

export default function ContactPage() {

  const router = useRouter();


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    subject: "",
    message: "",
    userType: "visitor",
  });


  const [status, setStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });



  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev)=>({
      ...prev,
      [name]: value
    }));

  };



  const validate = () => {

    if(!formData.name.trim())
      return "Please enter your name";


    if(!formData.email.trim())
      return "Please enter your email";


    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if(!emailRegex.test(formData.email))
      return "Please enter valid email";


    if(!formData.message.trim())
      return "Please enter your message";


    return "";

  };



  const handleSubmit = async(e)=>{

    e.preventDefault();


    const errorMessage = validate();


    if(errorMessage){

      setStatus({
        loading:false,
        success:"",
        error:errorMessage
      });

      return;

    }



    setStatus({
      loading:true,
      success:"",
      error:""
    });



    try{


      const response = await fetch(
        `${apiRoot}/contact`,
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json",
          },

          body:JSON.stringify(formData)

        }
      );



      const data = await response.json();



      if(!response.ok){

        throw new Error(
          data.message || "Failed to send message"
        );

      }



      setStatus({

        loading:false,

        success:
        "Your message has been sent successfully!",

        error:""

      });



      setFormData({

        name:"",
        email:"",
        mobile:"",
        subject:"",
        message:"",
        userType:"visitor"

      });



    }
    catch(error){


      setStatus({

        loading:false,

        success:"",

        error:error.message

      });


    }


  };




  return (

    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-5 py-12">


      <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-xl">





        <h1 className="text-center text-3xl font-bold text-gray-900">
          Contact Us
        </h1>


        <p className="mb-8 mt-3 text-center text-gray-500">
          Have questions about BNI membership,
          meetings or portal support?
        </p>




        {
          status.success && (

            <div className="mb-5 rounded-xl bg-green-100 p-3 text-green-700">

              {status.success}

            </div>

          )
        }



        {
          status.error && (

            <div className="mb-5 rounded-xl bg-red-100 p-3 text-red-700">

              {status.error}

            </div>

          )
        }




        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >



          <input

            name="name"

            placeholder="Full Name"

            value={formData.name}

            onChange={handleChange}

            disabled={status.loading}

            required

            className="w-full rounded-xl border p-3"

          />




          <input

            name="email"

            type="email"

            placeholder="Email Address"

            value={formData.email}

            onChange={handleChange}

            disabled={status.loading}

            required

            className="w-full rounded-xl border p-3"

          />




          <input

            name="mobile"

            placeholder="Mobile Number"

            value={formData.mobile}

            onChange={handleChange}

            disabled={status.loading}

            className="w-full rounded-xl border p-3"

          />


<div className="relative w-1/2">

  <select
    name="userType"
    value={formData.userType}
    onChange={handleChange}
    className="w-full appearance-none rounded-xl border p-3 pr-10"
  >

    <option value="visitor">
      Visitor
    </option>

    <option value="member">
      Member
    </option>

    <option value="admin">
      Admin
    </option>

  </select>


  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
    ▼
  </div>

</div>




          <input

            name="subject"

            placeholder="Subject"

            value={formData.subject}

            onChange={handleChange}

            required

            className="w-full rounded-xl border p-3"

          />





          <textarea

            name="message"

            rows="5"

            placeholder="Your Message"

            value={formData.message}

            onChange={handleChange}

            required

            className="w-full rounded-xl border p-3"

          />





          <button

            type="submit"

            disabled={status.loading}

            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"

          >

            {
              status.loading
              ? "Sending..."
              : "Send Message"
            }


          </button>



        </form>


      </div>


    </main>

  );

}