"use client";

import { useRouter } from "next/navigation";
import SiteLayout from "@/components/layout/SiteLayout";


const STORIES = [
  {
    name: "Rajesh Sharma",
    business: "Real Estate Consultant",
    chapter: "BNI Growth Chapter",
    result:
      "Generated quality business opportunities through member referrals and strengthened professional connections.",
    stats: "₹25L+ Business Generated",
  },

  {
    name: "Priya Mehta",
    business: "Digital Marketing Agency",
    chapter: "BNI Elite Chapter",
    result:
      "Built a strong referral network and increased monthly client acquisition through trusted partnerships.",
    stats: "50+ Qualified Referrals",
  },

  {
    name: "Amit Patil",
    business: "Financial Advisor",
    chapter: "BNI Success Chapter",
    result:
      "Improved business visibility by connecting with entrepreneurs from multiple industries.",
    stats: "100+ Business Connections",
  },

  {
    name: "Sneha Kulkarni",
    business: "Interior Designer",
    chapter: "BNI Connect Chapter",
    result:
      "Converted networking relationships into long-term business opportunities.",
    stats: "35+ Successful Referrals",
  },
];


const IMPACT = [
  {
    title:"More Connections",
    value:"10K+",
    description:"Members building trusted business relationships."
  },

  {
    title:"Successful Referrals",
    value:"5000+",
    description:"Business opportunities exchanged between members."
  },

  {
    title:"Active Chapters",
    value:"250+",
    description:"Communities growing through collaboration."
  },

  {
    title:"Business Generated",
    value:"₹50Cr+",
    description:"Value created through networking."
  }
];



export default function SuccessStoriesPage(){

const router = useRouter();


return (

<SiteLayout>
<main className="min-h-[calc(100vh-5rem)] bg-[#FAF9F7] text-[#1A1A1A]">


{/* Hero */}
<section className="pt-20 pb-28 bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
  <div className="container mx-auto px-6 flex flex-col items-center text-center">
    <h1 className="text-5xl font-bold">
      Success Stories
    </h1>

    <p className="mt-5 max-w-2xl text-lg text-white/80">
      Discover how BNI members grow their businesses,
      build relationships, and achieve success through
      the power of referrals.
    </p>

    <button
      onClick={() => router.push("/register")}
      className="mt-8 rounded-lg bg-[#D4A017] px-8 py-3 font-semibold text-[#1A1A1A] hover:bg-[#C29215]"
    >
      Join Our Network
    </button>
  </div>
</section>




{/* Impact */}

<section className="px-6 py-16">


<div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-4">


{
IMPACT.map((item)=>(


<div

key={item.title}

className="rounded-2xl bg-white p-6 text-center shadow-sm"

>


<h2 className="text-4xl font-bold text-blue-600">

{item.value}

</h2>


<h3 className="mt-3 font-semibold">

{item.title}

</h3>


<p className="mt-2 text-sm text-gray-500">

{item.description}

</p>


</div>


))
}


</div>


</section>





{/* Stories */}


<section className="px-6 py-16">


<div className="mx-auto max-w-5xl">


<h2 className="text-center text-3xl font-bold">

Member Success Stories

</h2>


<div className="mt-12 grid gap-8 md:grid-cols-2">


{
STORIES.map((story)=>(


<div

key={story.name}

className="rounded-3xl border bg-white p-8 shadow-sm hover:shadow-lg transition"

>


<div className="flex items-center gap-4">


<div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">

{story.name.charAt(0)}

</div>


<div>

<h3 className="text-xl font-bold">

{story.name}

</h3>


<p className="text-sm text-gray-500">

{story.business}

</p>

</div>


</div>



<div className="mt-5">

<span className="rounded-full bg-[#D4A017]/20 px-3 py-1 text-sm text-blue-600">

{story.chapter}

</span>


<p className="mt-5 text-gray-600">

{story.result}

</p>


<h4 className="mt-5 font-bold text-blue-600">

{story.stats}

</h4>


</div>



</div>


))

}


</div>


</div>


</section>





{/* Process */}


<section className="bg-white px-6 py-20">


<div className="mx-auto max-w-4xl text-center">


<h2 className="text-3xl font-bold">

How Success Happens

</h2>


<div className="mt-10 grid gap-6 md:grid-cols-4">


{
[
"Build Relationships",
"Exchange Referrals",
"Create Opportunities",
"Grow Together"
].map((step,index)=>(


<div

key={step}

className="rounded-xl bg-[#FAF9F7] p-5"

>


<div className="text-3xl font-bold text-[#D4A017]">

0{index+1}

</div>


<p className="mt-3 font-semibold">

{step}

</p>


</div>


))

}


</div>


</div>


</section>




{/* CTA */}


<section className="bg-[#1A1A1A] px-6 py-20 text-center text-white">


<h2 className="text-4xl font-bold">

Your Success Story Starts Here

</h2>


<p className="mt-4 text-white/70">

Join a community where businesses help each other grow.

</p>



<button

onClick={()=>router.push("/register")}

className="mt-8 rounded-lg bg-[#D4A017] px-8 py-3 font-semibold text-black"

>

Become A Member

</button>


</section>



</main>
</SiteLayout>

);

}