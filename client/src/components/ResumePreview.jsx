import React from 'react'
import { Mail, Phone, MapPin} from 'lucide-react';

const ResumePreview = ({ formData }) => {
  function getImageType(fileName) {
  const ext = fileName.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg'].includes(ext)) return 'jpeg';
  if (ext === 'png') return 'png';
  return 'jpeg'; 
}

    return (
        <div className="max-w-4xl mx-auto bg-white" id="resume-content">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{formData.fullName}</h1>
            <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
              {formData.email && (
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  <span>{formData.email}</span>
                </div>
              )}
              {formData.phone && (
                <div className="flex items-center gap-1">
                  <Phone size={16} />
                  <span>{formData.phone}</span>
                </div>
              )}
              {formData.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{formData.location}</span>
                </div>
              )}
            </div>
            <div className="flex gap-4 text-blue-600">
              {formData.linkedInURL && (
                <a href={formData.linkedInURL} className="hover:underline">LinkedIn</a>
              )}
              {formData.portfolioURL && (
                <a href={formData.portfolioURL} className="hover:underline">Portfolio</a>
              )}
            </div>
          </div>
        {formData.file_content && (
          <img
            src={`data:image/${getImageType(formData.file_name)};base64,${formData.file_content}`}
            alt="Profile"
            className="w-32 h-32 rounded-lg object-cover"
          />
        )}
        </div>

        {/* Professional Summary */}
        {formData.summary && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{formData.summary}</p>
          </div>
        )}

        {/* Skills */}
        {formData.skills && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {formData.skills.split(',').map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {formData.experience.some(exp => exp.title || exp.company) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">Work Experience</h2>
            {formData.experience.map((exp, i) => (
              exp.title || exp.company ? (
                <div key={i} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                      <p className="text-lg text-blue-600">{exp.company}</p>
                    </div>
                    <div className="text-gray-600 text-sm">
                      {exp.startDate} - {exp.endDate}
                    </div>
                  </div>
                  {exp.responsibilities && (
                    <p className="text-gray-700 mt-2">{exp.responsibilities}</p>
                  )}
                </div>
              ) : null
            ))}
          </div>
        )}

        {/* Education */}
        {formData.education.some(edu => edu.degree || edu.school) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">Education</h2>
            {formData.education.map((edu, i) => (
              edu.degree || edu.school ? (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-blue-600">{edu.school}</p>
                    </div>
                    <div className="text-gray-600 text-sm">
                      {edu.startYear} - {edu.endYear}
                    </div>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        )}

        {/* Volunteer Experience */}
        {formData.volunteer.some(vol => vol.vTitle || vol.vCompany) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">Volunteer Experience</h2>
            {formData.volunteer.map((vol, i) => (
              vol.vTitle || vol.vCompany ? (
                <div key={i} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{vol.vTitle}</h3>
                      <p className="text-lg text-blue-600">{vol.vCompany}</p>
                    </div>
                    <div className="text-gray-600 text-sm">
                      {vol.vStartDate} - {vol.vEndDate}
                    </div>
                  </div>
                  {vol.vResponsibilities && (
                    <p className="text-gray-700 mt-2">{vol.vResponsibilities}</p>
                  )}
                </div>
              ) : null
            ))}
          </div>
        )}

        {/* Certifications */}
        {formData.certifications.some(cert => cert.credential || cert.organization) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">Certifications</h2>
            {formData.certifications.map((cert, i) => (
              cert.credential || cert.organization ? (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{cert.credential}</h3>
                      <p className="text-blue-600">{cert.organization}</p>
                    </div>
                    <div className="text-gray-600 text-sm">{cert.yearGotten}</div>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        )}
      </div>
    </div>
    )
}

export default ResumePreview
