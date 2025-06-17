import BuilderForm from "./components/BuilderForm"
function App() {

  return (
    <div className="flex flex-col items-center justify-center bg-blue-100">
      <div className="bg-white p-4 rounded-lg shadow m-8 p-6">
        <h1 className="text-4xl font-bold text-center p-4">Hello Resume builder</h1>
       <BuilderForm/>
      </div>
    </div>
  )
}

export default App
