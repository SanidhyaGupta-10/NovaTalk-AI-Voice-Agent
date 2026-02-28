import UploadForm from "@/components/UploadForm"

function page() {
  return (
    <main className="wrapper container">
      <div className="mx-auto max-w-1820 space-y-10">
        <section className="flex flex-col gap-5">
          <div className="flex justify-center place-items-center flex-col gap-2">
            <h1 className="page-title-xl">Add New Book</h1>
            <p className="subtitle">Upload a PDF to get started</p>
          </div>
        </section>

        <UploadForm />
      </div>
    </main>
  )
}

export default page