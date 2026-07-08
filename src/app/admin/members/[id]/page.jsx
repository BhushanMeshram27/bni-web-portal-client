"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/services/api";

export default function AdminMemberDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [member, setMember] = useState(null);
  const [chapters, setChapters] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleting, setDeleting] = useState(false);

  const [savingChapter, setSavingChapter] = useState(false);
  const [chapterMessage, setChapterMessage] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");


  useEffect(() => {
    if (id) {
      fetchMember();
      fetchChapters();
    }
  }, [id]);


  const fetchMember = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await api.get(`/members/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      const memberData =
        res.data.data || res.data.member || null;


      setMember(memberData);


      setSelectedChapter(
        memberData?.chapter?._id ||
        memberData?.chapter ||
        ""
      );


    } catch (err) {

      console.error("Fetch Member Error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to load member details."
      );

    } finally {
      setLoading(false);
    }
  };



  const fetchChapters = async () => {

    try {

      const token = localStorage.getItem("token");


      const res = await api.get("/chapters", {
        headers:{
          Authorization:`Bearer ${token}`,
        },
      });


      setChapters(res.data.data || []);


    } catch(err){

      console.error("Fetch Chapters Error:", err);

      setChapters([]);

    }

  };



  // only change dropdown value
  const handleChapterChange = (e)=>{

    setSelectedChapter(e.target.value);

    setChapterMessage("");

  };




  // save chapter
  const handleUpdateChapter = async()=>{

    try{

      setSavingChapter(true);

      setChapterMessage("");


      const token = localStorage.getItem("token");


      const res = await api.put(

        `/members/${id}`,

        {
          chapter:selectedChapter || null,
        },

        {
          headers:{
            Authorization:`Bearer ${token}`,
          },
        }

      );



      setMember((prev)=>({

        ...prev,

        chapter:res.data.chapter,

      }));


      setChapterMessage(
        "Chapter updated successfully."
      );



    }catch(err){


      console.error(
        "Update Chapter Error:",
        err
      );


      setChapterMessage(

        err.response?.data?.message ||

        "Failed to update chapter."

      );


    }finally{

      setSavingChapter(false);

    }

  };




  const handleDelete = async()=>{


    if(!confirm("Delete member?")) return;


    try{

      setDeleting(true);


      const token = localStorage.getItem("token");


      await api.delete(`/members/${id}`,{

        headers:{
          Authorization:`Bearer ${token}`,
        },

      });


      router.push("/admin/members");


    }catch(err){

      console.error(
        "Delete Error:",
        err
      );


      alert(
        err.response?.data?.message ||
        "Delete failed"
      );


    }finally{

      setDeleting(false);

    }

  };



  if(loading){

    return(
      <div className="p-6 text-xl font-semibold">
        Loading Member...
      </div>
    );

  }






  return (

    <div className="p-6 max-w-2xl mx-auto">

      <div className="bg-white rounded-xl shadow p-6">


        <div className="flex justify-between mb-6">

          <h1 className="text-2xl font-bold">
            {member.name}
          </h1>


          <button

            onClick={handleDelete}

            disabled={deleting}

            className="bg-red-600 text-white px-3 py-2 rounded"

          >

            {deleting ? "Deleting..." : "Delete"}

          </button>


        </div>



        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">


          <div>
            <dt className="text-gray-500">
              Email
            </dt>

            <dd className="font-medium">
              {member.email}
            </dd>
          </div>



          <div>
            <dt className="text-gray-500">
              Mobile
            </dt>

            <dd className="font-medium">
              {member.mobile || "—"}
            </dd>
          </div>



          <div>
            <dt className="text-gray-500">
              Business Name
            </dt>

            <dd className="font-medium">
              {member.businessName || "—"}
            </dd>
          </div>



          <div>
            <dt className="text-gray-500">
              Profession
            </dt>

            <dd className="font-medium">
              {member.profession || "—"}
            </dd>
          </div>



        



          <div>
            <dt className="text-gray-500">
              Role
            </dt>

            <dd className="font-medium capitalize">
              {member.role}
            </dd>
          </div>


        </dl>




        <div className="mt-6 pt-6 border-t">


          <label className="block text-sm font-medium mb-2">

            Chapter

          </label>



          <select

            value={selectedChapter}

            onChange={handleChapterChange}

            disabled={savingChapter}

            className="w-full sm:w-72 border rounded-lg px-3 py-2"

          >

            <option value="">
              Not assigned
            </option>


            {chapters.map((c)=>(

              <option
                key={c._id}
                value={c._id}
              >

                {c.name}

              </option>

            ))}


          </select>




          <button

            onClick={handleUpdateChapter}

            disabled={savingChapter}

            className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg"

          >

            {savingChapter
              ? "Updating..."
              : "Update Chapter"
            }


          </button>



          {chapterMessage && (

            <p className="mt-2 text-sm text-gray-600">

              {chapterMessage}

            </p>

          )}


        </div>


      </div>


    </div>

  );

}