import { PhoneAuthDrawer } from "@/components/PhoneAuthDrawer";
import useMediaQuery from "@/hooks/mediaQuery";
import { UploadDropzone } from "@/utils/uploadthing";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
export default function Upload() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const router = useRouter();
  const [show, setShow] = React.useState(false);
  const { status } = useSession();
  React.useEffect(() => {
    if (status === "unauthenticated") setShow(true);
  }, [status]);
  return (
    <main
      className={`mt-10 flex min-h-screen flex-col items-center justify-start p-4 ${!isMobile ? "mx-auto w-[70%]" : ""}`}
    >
      <h1 className="mb-4 text-2xl font-semibold">Upload Your Prescription</h1>
      {show ? (
        <PhoneAuthDrawer open={show} />
      ) : (
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
      )}
    </main>
  );
}
