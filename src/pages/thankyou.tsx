import { useRouter } from "next/navigation";
import React from "react";

export default function Thankyou() {
  const router = useRouter();
  const [time, setTime] = React.useState(0);
  React.useEffect(() => {
    if (time === 5) {
      router.replace("/home");
      return;
    }
    const timer = setInterval(() => {
      setTime((time) => time + 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [router, time]);
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="rounded bg-gradient-to-r from-purple-500 via-green-500 to-blue-500 p-1 shadow-lg">
        <div className="flex flex-col items-center space-y-2 bg-white p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-28 w-28 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-4xl font-extrabold text-transparent">
            Thank You !
          </h1>
          <p className="text-center">
            Your Prescription has reached us, we would get back you shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
