import React, {useState} from 'react'
import "../index.css"

const API_URL = "http://localhost:8001/resume"

const BuilderForm = () => {
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

        // Limit to maxItems
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
 

    const handleSubmit = e =>{
        e.preventDefault();
        console.log("Resume Data:", formData)
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className="section-box">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <div className="gap-4 grid w-full grid-flow-col">
                    <input className="input-field" name="fullName" placeholder="Full Name" onChange={handleChange} required/>
                    <input className="input-field" name="email" placeholder="Email Address" onChange={handleChange} required/>
                    <input className="input-field" name="phone" placeholder="Phone Number" onChange={handleChange} required/>
                </div>
                <div className="gap-4 grid w-full grid-flow-col">
                    <input className="input-field" name="pportfolioURL" placeholder="Portfolio URL" onChange={handleChange} required/>
                    <input className="input-field" name="linkedinURL" placeholder="LinkedIn URL" onChange={handleChange} required/>
                </div>
            </div>
            <div className="section-box">
                <h2 className="text-2xl font-bold text-gray-900">Professional Summary</h2>
                <textarea rows="4"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="summary" placeholder="Brief Summary about you." required></textarea>
            </div>
            <div className="section-box">
                <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
                <div className="gap-4 grid w-full grid-flow-col">
                 <input className="input-field" name="skills" placeholder="Add Skills" required/>
                </div>
            </div>
             <div className="section-box">
                <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
                {formData.experience.map((exp, i) =>(
                    <div key={i}>
                        <div className="gap-4 grid w-full grid-flow-col">
                            <input  className="input-field" placeholder="Job Title" value={exp.title || ""}
                            onChange={e => handleNestedFields(i, "title", e.target.value, "experience")} required/>
                            <input className="input-field"  placeholder="Company" value={exp.company || ""}
                            onChange={e => handleNestedFields(i, "company", e.target.value, "experience")} required/>
                        </div>
                        <div className="gap-4 grid w-full grid-flow-col pt-4">
                            <input className="input-field"  placeholder="Start Date" value={exp.startDate || ""}
                            onChange={e => handleNestedFields(i, "startDate", e.target.value, "experience")} required/>
                            <input  className="input-field" placeholder="End Date" value={exp.endDate || ""}
                            onChange={e => handleNestedFields(i, "endDate", e.target.value, "experience")} required/>
                        </div>
                        <div className="gap-4 grid w-full grid-flow-col pt-4">
                            <input className="input-field"  placeholder="Responsibilities" value={exp.responsibilities || ""}
                            onChange={e => handleNestedFields(i, "responsibilities", e.target.value, "experience")} required/>
                        </div>
                        {formData.experience.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeSection("experience", i)}
                            className="relative top-2 right-2 text-red-500 text-sm"
                        >
                            🗑 Remove
                        </button>
                        )}
                    </div>
                ))}
                <button className="btn-primary" type="button" onClick={() => addSection("experience", 5)}>+ Add Experience</button>
            </div>
            <div className="section-box">
                <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                {formData.education.map((edu, i) =>(
                    <div key={i}>
                        <div className="gap-4 grid w-full grid-flow-col">
                            <input className="input-field" placeholder="Degree" value={edu.degree || ""}
                            onChange={e => handleNestedFields(i, "degree", e.target.value, "education")} required/>
                            <input className="input-field" placeholder="School" value={edu.school || ""}
                            onChange={e => handleNestedFields(i, "school", e.target.value, "education")} required/>
                        </div>
                        <div className="gap-4 grid w-full grid-flow-col pt-4">
                            <input className="input-field" placeholder="Start Year" value={edu.startYear || ""}
                            onChange={e => handleNestedFields(i, "startYear", e.target.value, "education")} required/>
                            <input className="input-field" placeholder="End Year" value={edu.endYear || ""}
                            onChange={e => handleNestedFields(i, "endYear", e.target.value, "education")} required/>
                        </div>
                        {formData.experience.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeSection("education", i)}
                            className="relative top-2 right-2 text-red-500 text-sm"
                        >
                            🗑 Remove
                        </button>
                        )}
                    </div>
                ))}
                <button className="btn-primary"  type="button" onClick={() => addSection("education", 4)}>+ Add Education</button>
            </div>
            <div className="section-box">
                <h2 className="text-2xl font-bold text-gray-900">Voluteer Experience</h2>
                {formData.volunteer.map((vol, i) =>(
                    <div key={i}>
                        <div className="gap-4 grid w-full grid-flow-col">
                            <input className="input-field" placeholder="Job Title" value={vol.vTitle || ""}
                            onChange={e => handleNestedFields(i, "vTitle", e.target.value, "volunteer")}/>
                            <input className="input-field" placeholder="Company" value={vol.vCompany || ""}
                            onChange={e => handleNestedFields(i, "vCompany", e.target.value, "volunteer")}/>
                        </div>
                        <div className="gap-4 grid w-full grid-flow-col pt-4">
                            <input className="input-field" placeholder="Start Date" value={vol.vStartDate || ""}
                            onChange={e => handleNestedFields(i, "vStartDate", e.target.value, "volunteer")}/>
                            <input className="input-field" placeholder="End Date" value={vol.vEndDate || ""}
                            onChange={e => handleNestedFields(i, "vEndDate", e.target.value, "volunteer")}/>
                        </div>
                        <div className="gap-4 grid w-full grid-flow-col pt-4 ">
                            <input className="input-field" placeholder="Responsibilities" value={vol.vResponsibilities || ""}
                            onChange={e => handleNestedFields(i, "vResponsibilities", e.target.value, "volunteer")}/>
                        </div>
                        {formData.experience.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeSection("volunteer", i)}
                            className="relative top-2 right-2 text-red-500 text-sm"
                        >
                            🗑 Remove
                        </button>
                        )}
                    </div>
                ))}
                <button className="btn-primary" type="button" onClick={() => addSection("volunteer", 5)}>+ Add Volunteer Experience</button>
            </div>
            <div className="section-box">
                <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
                {formData.certifications.map((cert, i) =>(
                    <div key={i} className="gap-4 grid w-full grid-flow-col">
                        <input className="input-field" placeholder="Credential" value={cert.credential || ""}
                        onChange={e => handleNestedFields(i, "credential", e.target.value, "certifications")}/>
                        <input className="input-field" placeholder="Organization" value={cert.organization || ""}
                        onChange={e => handleNestedFields(i, "organization", e.target.value, "certifications")}/>
                        <input className="input-field" placeholder="Year Issued" value={cert.yearGotten || ""}
                        onChange={e => handleNestedFields(i, "yearGotten", e.target.value, "certifications")}/>
                        {formData.experience.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeSection("certifications", i)}
                            className="relative top-2 right-2 text-red-500 text-sm"
                        >
                            🗑 Remove
                        </button>
                        )}
                    </div>
                ))}
                <button className="btn-primary"  type="button" onClick={() => addSection("certifications", 4)}>+ Add Certification</button>
            </div>
            <div className="mt-4 text-center ">
                <button className="btn-primary p-4" type="submit">Generate Resume</button>
            </div>
        </form>
    )
}

export default BuilderForm
