import React, {useState,useEffect} from 'react';
import { AlertCircle, Target} from 'lucide-react';


const SmartAnalysis = ({formData, optimization, setOptimization, onPreview}) => {
    const performSmartAnalysis = () => {
        let score = 0;
        let atsScore = 0;
        let suggestions = [];
        let keywordRecommendations = [];
        let industryInsights = [];
        let contentImprovements = [];

        // Basic completeness check
        const requiredFields = ['fullName', 'email', 'phone', 'summary', 'skills'];
        const completedFields = requiredFields.filter(field => formData[field]?.trim());
        score += (completedFields.length / requiredFields.length) * 30;

        // Experience analysis
        const validExperience = formData.experience.filter(exp => 
            exp.title && exp.company && exp.startDate && exp.responsibilities
            );
            if (validExperience.length > 0) {
                score += 25;
                atsScore += 20;
            } else {
                suggestions.push({
                    type: 'critical',
                    message: 'Add at least one complete work experience entry'
            });
        }

        // Skills analysis
        if (formData.skills) {
        const skillsArray = formData.skills.split(',').map(s => s.trim());
        const industryKeywords = atsKeywords[formData.targetIndustry] || [];
        const matchedKeywords = skillsArray.filter(skill => 
            industryKeywords.some(keyword => 
            keyword.toLowerCase().includes(skill.toLowerCase()) || 
            skill.toLowerCase().includes(keyword.toLowerCase())
            )
        );
        
        atsScore += Math.min((matchedKeywords.length / industryKeywords.length) * 40, 40);
        
        if (matchedKeywords.length < 3) {
            keywordRecommendations = industryKeywords.slice(0, 5).map(keyword => ({
            keyword,
            importance: 'high',
            reason: `Essential for ${formData.targetIndustry} roles`
            }));
        }
        }

        // Summary analysis
        if (formData.summary) {
        const summaryLength = formData.summary.split(' ').length;
        if (summaryLength >= 50 && summaryLength <= 150) {
            score += 20;
            atsScore += 15;
        } else if (summaryLength < 50) {
            contentImprovements.push({
            field: 'summary',
            issue: 'Too short',
            suggestion: 'Expand your summary to 50-150 words for better impact'
            });
        } else {
            contentImprovements.push({
            field: 'summary',
            issue: 'Too long',
            suggestion: 'Keep your summary concise (50-150 words) for better readability'
            });
        }
        }

        // Education analysis
        const validEducation = formData.education.filter(edu => 
        edu.degree && edu.school
        );
        if (validEducation.length > 0) {
        score += 15;
        atsScore += 10;
        }

        // Industry-specific insights
        switch (formData.targetIndustry) {
        case 'technology':
            industryInsights.push({
            title: 'Tech Industry Focus',
            insight: 'Emphasize technical skills, projects, and continuous learning',
            action: 'Consider adding a projects section or GitHub links'
            });
            break;
        case 'healthcare':
            industryInsights.push({
            title: 'Healthcare Standards',
            insight: 'Highlight certifications, patient care experience, and compliance knowledge',
            action: 'Ensure all medical certifications are current and prominently displayed'
            });
            break;
        case 'finance':
            industryInsights.push({
            title: 'Financial Sector Requirements',
            insight: 'Quantify achievements with financial metrics and emphasize analytical skills',
            action: 'Include specific dollar amounts, percentages, or ROI figures where possible'
            });
            break;
        }

        // Final scoring
        score = Math.min(score, 100);
        atsScore = Math.min(atsScore, 100);

        return {
        score: Math.round(score),
        atsScore: Math.round(atsScore),
        suggestions,
        keywordRecommendations,
        industryInsights,
        contentImprovements
        };
    };

const atsKeywords = {
    technology: ['JavaScript', 'Python', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'Agile', 'Scrum', 'Git', 'API', 'Database', 'Machine Learning', 'DevOps'],
    healthcare: ['Patient Care', 'Electronic Health Records', 'HIPAA', 'Clinical Research', 'Medical Terminology', 'Healthcare Management', 'Quality Assurance', 'Regulatory Compliance'],
    finance: ['Financial Analysis', 'Risk Management', 'Portfolio Management', 'Excel', 'SQL', 'Bloomberg', 'Financial Modeling', 'Compliance', 'Audit', 'Investment Banking'],
    marketing: ['Digital Marketing', 'SEO', 'SEM', 'Social Media', 'Content Marketing', 'Analytics', 'Campaign Management', 'Brand Management', 'Lead Generation', 'CRM'],
    engineering: ['CAD', 'Project Management', 'Quality Control', 'Process Improvement', 'Six Sigma', 'Lean Manufacturing', 'Technical Documentation', 'Safety Protocols']
};

const handleContinue = () => {
  const result = performSmartAnalysis();
  setOptimization(result);
    const modifiedFormData = {
    ...formData,
    summary:
      optimization.contentImprovements.find(c => c.field === 'summary' && c.suggestion)?.suggestion ||
      formData.summary,
    skills: optimization.keywordRecommendations.length
      ? [...formData.skills.split(','), ...optimization.keywordRecommendations.map(k => k.keyword)]
          .filter((v, i, a) => a.indexOf(v) === i) // remove duplicates
          .join(',')
      : formData.skills,
    // You can do similar logic for experience, education, etc.
  };
  onPreview(modifiedFormData);
};

const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
};

  const getScoreBg = (score) => {
        if (score >= 80) return 'bg-green-100';
        if (score >= 60) return 'bg-yellow-100';
        return 'bg-red-100';
    };

    const [isAnalyzing, setIsAnalyzing] = useState(true);

useEffect(() => {
  const result = performSmartAnalysis();
  setOptimization(result);
  setIsAnalyzing(false);
}, []);

if (isAnalyzing) {
  return <p className="text-center text-gray-600">Analyzing your resume...</p>;
}

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            
        <div className=" bg-white rounded-lg shadow-lg p-8">
              {/* Score Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-6 rounded-lg ${getScoreBg(optimization.score)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Overall Score</h3>
                      <p className="text-sm text-gray-600">Resume completeness and quality</p>
                    </div>
                    <div className={`text-3xl font-bold ${getScoreColor(optimization.score)}`}>
                      {optimization.score}/100
                    </div>
                  </div>
                </div>
                <div className={`p-6 rounded-lg ${getScoreBg(optimization.atsScore)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">ATS Score</h3>
                      <p className="text-sm text-gray-600">Applicant Tracking System compatibility</p>
                    </div>
                    <div className={`text-3xl font-bold ${getScoreColor(optimization.atsScore)}`}>
                      {optimization.atsScore}/100
                    </div>
                  </div>
                </div>
              </div>



              {/* Keyword Recommendations */}
              {optimization.keywordRecommendations.length > 0 && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target size={20} />
                    Keyword Recommendations
                  </h3>
                  <div className="space-y-3">
                    {optimization.keywordRecommendations.map((rec, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <span className="font-medium text-blue-900">{rec.keyword}</span>
                          <p className="text-sm text-gray-600">{rec.reason}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          rec.importance === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {rec.importance} priority
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {optimization.suggestions.length > 0 && (
                <div className="bg-red-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle size={20} />
                    Critical Issues
                  </h3>
                  <div className="space-y-3">
                    {optimization.suggestions.map((suggestion, i) => (
                      <div key={i} className="p-3 bg-white rounded-lg border-l-4 border-red-500">
                        <div className="flex items-center gap-3">
                          <AlertCircle size={16} className="text-red-600" />
                          <p className="text-gray-900">{suggestion.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
                  className="cursor-pointer bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
                  type="button"
                  onClick={() => onPreview(formData)}
                >
                    Go to Preview
                </button>
        </div>
  );
};

export default SmartAnalysis
