import React from 'react'
import "../index.css";
import { User, Award, Briefcase, GraduationCap, Heart, Plus, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/resume";

const BuilderForm = ({ formData, setFormData, resumeFile, setResumeFile, imagePreview, setImagePreview, onPreview }) => {
    
    const handleChange = e =>{
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    }
    const handleNestedFields = (index, field, value, section) =>{
        const updated = [...formData[section]];
        updated[index][field] = value;
        setFormData((prev) => ({...prev, [section]: updated}))
    }
    const addSection = (section, maxItems = 5) => {
    setFormData((prev) => {
        const sectionData = prev[section];

        // Limit to max items
        if (sectionData.length >= maxItems) {
        alert(`You can only add up to ${maxItems} entries for ${section}.`);
        return prev;
        }

        // Validate last entry
        const lastEntry = sectionData[sectionData.length - 1];

        const isLastEntryFilled =
        lastEntry && Object.values(lastEntry).every(val => val && val.trim() !== "");

        if (!isLastEntryFilled) {
        alert("Please fill in all fields before adding a new one.");
        return prev;
        }

        // Add new empty entry
        return {
        ...prev,
        [section]: [...sectionData, {}],
        };
    });
    };
    const removeSection = (section, index) => {
    setFormData(prev => {
        const updated = [...prev[section]];
        updated.splice(index, 1);
        return {
            ...prev,
            [section]: updated.length ? updated : [{}],
            };
        });
    };
 

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith("image/")) {
    setResumeFile(file); // ✅ store the file
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();
  form.append("resume", JSON.stringify(formData));
   if (resumeFile) {
    form.append("file", resumeFile); // ✅ send file
  }
  for (let pair of form.entries()) {
  console.log(pair[0], pair[1]);
}
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: form,
    });

    const result = await response.json();

    if (response.ok) {
      alert("Resume submitted!");
      onPreview({
        ...formData,
        file_name: resumeFile.name,
        file_content: imagePreview.split(',')[1],  // extract base64
      });
    } else {
      alert(result.detail || "Failed to submit resume.");
    }
  } catch (error) {
    alert("Submission error: " + error.message);
  }
};



    return (
    <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Resume Builder</h1>
            <form>
            <div className="space-y-8">
              {/* Professional Image */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User size={24} />
                  Professional Image
                </h2>
                <p className="text-sm text-gray-600 mb-4">Upload a professional image for your resume. Accepted formats: (.jpg, .jpeg, .png) Max size: 2MB</p>
                <input 
                  type="file" 
                  accept=".jpg,.jpeg,.png" 
                  onChange={handleImageUpload} 
                  className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 rounded-lg object-cover" />}
              </div>
    
              {/* Personal Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    name="fullName" 
                    placeholder="Full Name" 
                    value={formData.fullName || ""}
                    onChange={handleChange} 
                    required
                  />
                  <input 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    name="email" 
                    type="email"
                    placeholder="Email Address" 
                    value={formData.email|| ""}
                    onChange={handleChange} 
                    required
                  />
                  <input 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    name="phone" 
                    placeholder="Phone Number" 
                    value={formData.phone || ""}
                    onChange={handleChange} 
                    required
                  />
                  <input 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    name="location" 
                    placeholder="Location (City, State)" 
                    value={formData.location || ""}
                    onChange={handleChange}
                  />
                  <input 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    name="portfolioURL" 
                    placeholder="Portfolio URL" 
                    value={formData.portfolioURL || ""}
                    onChange={handleChange}
                  />
                  <input 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    name="linkedInURL" 
                    placeholder="LinkedIn URL" 
                    value={formData.linkedInURL || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
    
              {/* Professional Summary */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Summary</h2>
                <textarea 
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  name="summary" 
                  placeholder="Brief summary about yourself and your professional goals..."
                  onChange={handleChange}
                  value={formData.summary || ""}
                  required
                />
              </div>
    
              {/* Skills */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
                <input 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  name="skills" 
                  placeholder="Add skills separated by commas (e.g., JavaScript, React, Node.js)"
                  value={formData.skills || ""}
                  onChange={handleChange}
                  required
                />
              </div>
    
              {/* Work Experience */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase size={24} />
                  Work Experience
                </h2>
                {formData.experience.map((exp, i) => (
                  <div key={i} className="mb-6 p-4 bg-white rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Job Title" 
                        value={exp.title || ""}
                        onChange={e => handleNestedFields(i, "title", e.target.value, "experience")} 
                        required
                      />
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Company" 
                        value={exp.company || ""}
                        onChange={e => handleNestedFields(i, "company", e.target.value, "experience")} 
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Start Date (e.g., Jan 2020)" 
                        value={exp.startDate || ""}
                        onChange={e => handleNestedFields(i, "startDate", e.target.value, "experience")} 
                        required
                      />
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="End Date (e.g., Present)" 
                        value={exp.endDate || ""}
                        onChange={e => handleNestedFields(i, "endDate", e.target.value, "experience")} 
                        required
                      />
                    </div>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="Key responsibilities and achievements..."
                      rows="3"
                      value={exp.responsibilities || ""}
                      onChange={e => handleNestedFields(i, "responsibilities", e.target.value, "experience")} 
                      required
                    />
                    {formData.experience.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection("experience", i)}
                        className="mt-2 flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" 
                  type="button" 
                  onClick={() => addSection("experience", 5)}
                >
                  <Plus size={16} />
                  Add Experience
                </button>
              </div>
    
              {/* Education */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap size={24} />
                  Education
                </h2>
                {formData.education.map((edu, i) => (
                  <div key={i} className="mb-6 p-4 bg-white rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Degree" 
                        value={edu.degree || ""}
                        onChange={e => handleNestedFields(i, "degree", e.target.value, "education")} 
                        required
                      />
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="School/University" 
                        value={edu.school || ""}
                        onChange={e => handleNestedFields(i, "school", e.target.value, "education")} 
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Start Year" 
                        value={edu.startYear || ""}
                        onChange={e => handleNestedFields(i, "startYear", e.target.value, "education")} 
                        required
                      />
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="End Year" 
                        value={edu.endYear || ""}
                        onChange={e => handleNestedFields(i, "endYear", e.target.value, "education")} 
                        required
                      />
                    </div>
                    {formData.education.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection("education", i)}
                        className="mt-2 flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" 
                  type="button" 
                  onClick={() => addSection("education", 4)}
                >
                  <Plus size={16} />
                  Add Education
                </button>
              </div>
    
              {/* Volunteer Experience */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Heart size={24} />
                  Volunteer Experience
                </h2>
                {formData.volunteer.map((vol, i) => (
                  <div key={i} className="mb-6 p-4 bg-white rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Role/Position" 
                        value={vol.vTitle || ""}
                        onChange={e => handleNestedFields(i, "vTitle", e.target.value, "volunteer")}
                      />
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Organization" 
                        value={vol.vCompany || ""}
                        onChange={e => handleNestedFields(i, "vCompany", e.target.value, "volunteer")}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Start Date" 
                        value={vol.vStartDate || ""}
                        onChange={e => handleNestedFields(i, "vStartDate", e.target.value, "volunteer")}
                      />
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="End Date" 
                        value={vol.vEndDate || ""}
                        onChange={e => handleNestedFields(i, "vEndDate", e.target.value, "volunteer")}
                      />
                    </div>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                      placeholder="Responsibilities and impact..."
                      rows="3"
                      value={vol.vResponsibilities || ""}
                      onChange={e => handleNestedFields(i, "vResponsibilities", e.target.value, "volunteer")}
                    />
                    {formData.volunteer.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection("volunteer", i)}
                        className="mt-2 flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" 
                  type="button" 
                  onClick={() => addSection("volunteer", 5)}
                >
                  <Plus size={16} />
                  Add Volunteer Experience
                </button>
              </div>
    
              {/* Certifications */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award size={24} />
                  Certifications
                </h2>
                {formData.certifications.map((cert, i) => (
                  <div key={i} className="mb-4 p-4 bg-white rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Certification Name" 
                        value={cert.credential || ""}
                        onChange={e => handleNestedFields(i, "credential", e.target.value, "certifications")}
                      />
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Issuing Organization" 
                        value={cert.organization || ""}
                        onChange={e => handleNestedFields(i, "organization", e.target.value, "certifications")}
                      />
                      <input 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="Year Issued" 
                        value={cert.yearGotten || ""}
                        onChange={e => handleNestedFields(i, "yearGotten", e.target.value, "certifications")}
                      />
                    </div>
                    {formData.certifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection("certifications", i)}
                        className="mt-2 flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" 
                  type="button" 
                  onClick={() => addSection("certifications", 4)}
                >
                  <Plus size={16} />
                  Add Certification
                </button>
              </div>
    
              <div className="text-center">
                <button 
                  type="submit"
                  className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg" 
                  onClick={handleSubmit}
                >
                  Generate Resume
                </button>
              </div>
              </div>
            </form>
          </div>
        </div>
    )
}

export default BuilderForm
