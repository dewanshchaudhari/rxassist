import { UploadDropzone } from "@/utils/uploadthing";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
export default function Upload() {
  const router = useRouter();
  const { data } = useSession();
  console.log(data);
  return (
    <main className="mt-10 flex min-h-screen flex-col items-center justify-start">
      <h1 className="text-2xl font-semibold">Upload Your Prescription</h1>
      <div className="w-full p-4">
        <UploadDropzone
          className="w-full"
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            // Do something with the response
            console.log("Files: ", res);
            alert("Upload Completed");
            router.push("/thankyou");
          }}
          onUploadError={(error: Error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />
      </div>
    </main>
  );
}
