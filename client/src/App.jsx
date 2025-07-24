import {useState, useRef} from 'react'
import BuilderForm from "./components/BuilderForm"
import ResumePreview from "./components/ResumePreview"
import {Download} from "lucide-react";
import { useReactToPrint } from "react-to-print";

function App() {
  const [currentStep, setCurrentStep] = useState('form');
  const [imagePreview, setImagePreview] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        linkedInURL: "",
        portfolioURL: "",
        summary: "",
        skills: "",
        education: [{degree: "", school: "", startYear: "", endYear: ""}],
        experience: [{title: "", company: "", startDate: "", endDate: "", responsibilities: "" }],
        volunteer: [{vTitle: "", vCompany: "", vStartDate: "", vEndDate: "", vResponsibilities: "" }],
        certifications: [{credential: "", organization: "", yearGotten: ""}]
    })

  const contentRef = useRef();

  const handlePrint = useReactToPrint({contentRef});

  const goBackToForm = () => {
    setCurrentStep('form');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {currentStep === 'form' && (
        <BuilderForm
          formData={formData}
          setFormData={setFormData}
          resumeFile={resumeFile}
          setResumeFile={setResumeFile}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          onPreview={(data) => {
          setFormData(data);
          setCurrentStep('preview');
        }}
        />
      )}

      {currentStep === 'preview' && (
        <div className="p-6">
          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex gap-4 justify-center">
              <button 
                onClick={goBackToForm}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Back to Edit
              </button>
              <button 
                onClick={handlePrint}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download size={20} />
                Download Resume
              </button>
            </div>
          </div>
          <div ref={contentRef} className="bg-white p-8 rounded-lg shadow-lg">
            <ResumePreview formData={formData} imagePreview={imagePreview} /> 
          </div>
        </div>
)}
    </div>
  )
}

export default App
