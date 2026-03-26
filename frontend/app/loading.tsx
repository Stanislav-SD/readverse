import "@/app/style/somestyle.css"
export default function Loading() {
  return (
    <main className="flex justify-center items-center h-screen bg-black">
      <div className="book-loader">
        <div className="page page1"></div>
        <div className="page page2"></div>
        <div className="page page3"></div>
      </div>
    </main>
  );
}