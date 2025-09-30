import {useState, useRef} from 'react'
import BuilderForm from "./components/BuilderForm"
import SmartAnalysis from "./components/SmartAnalysis"
import ResumePreview from "./components/ResumePreview"
import {Download} from "lucide-react";
import { useReactToPrint } from "react-to-print";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/resume";

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
        targetIndustry: 'technology',
        targetRole: '',
        education: [{degree: "", school: "", startYear: "", endYear: ""}],
        experience: [{title: "", company: "", startDate: "", endDate: "", responsibilities: "" }],
        volunteer: [{vTitle: "", vCompany: "", vStartDate: "", vEndDate: "", vResponsibilities: "" }],
        certifications: [{credential: "", organization: "", yearGotten: ""}]
    })

  // FOR GENAI
  const [optimization, setOptimization] = useState({
    score: 0,
    atsScore: 0,
    suggestions: [],
    keywordRecommendations: [],
    industryInsights: [],
    contentImprovements: []
  });

const contentRef = useRef();

const handlePrint = useReactToPrint({contentRef});

const handleDownload = async () => {
  try {
    const form = new FormData();
    form.append("resume", JSON.stringify(formData));
    if (resumeFile) {
      form.append("file", resumeFile);
    }

    const response = await fetch(API_URL, {
      method: "POST",
      body: form,
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Resume saved:", result);
      handlePrint(); // print AFTER saving
    } else {
      alert(result.detail || "Failed to save resume.");
    }
  } catch (error) {
    alert("Error saving resume before download: " + error.message);
  }
};


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
          setCurrentStep={setCurrentStep}
          onPreview={(data) => {
          setFormData(data);
          setCurrentStep('optimization'); // Go to optimization step
        }}
        onSkipToPreview={(data) => {
        setFormData(data);
        setCurrentStep('preview'); // Go straight to preview
      }}
        />
      )}
      {currentStep === 'optimization' && (
        <div className='p-6'>
          <div className="max-w-4xl mx-auto mb-6">
            <div className='flex gap-4 justify-center'>
              <button 
                onClick={goBackToForm}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Back to Edit
              </button>
            </div>
          </div>
          <div>
            <SmartAnalysis
              formData={formData}
              optimization={optimization}
              setOptimization={setOptimization}
              onPreview={(data) => {
              setFormData(data);
              setCurrentStep('preview');
            }}
            />
          </div>
        </div>
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
                onClick={handleDownload}
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
