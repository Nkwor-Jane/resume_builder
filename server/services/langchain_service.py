from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
import os
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7, api_key=os.getenv("OPENAI_API_KEY"))

async def analyze_resume_with_langchain(resume_data: dict) -> dict:
    summary = resume_data.get("summary", "")
    skills = resume_data.get("skills", "")
    target_role = resume_data.get("targetRole", "")
    target_industry = resume_data.get("targetIndustry", "")

    prompt = f"""
    You are an expert resume reviewer for the {target_industry} industry.
    Review the following resume summary and skills, and give optimization suggestions
    tailored for a {target_role} role.

    Summary:
    {summary}

    Skills:
    {skills}

    Return:
    - A 1-paragraph feedback on the summary.
    - 5 recommended keywords to improve ATS score.
    - Any missing content areas.
    """

    response = llm([
        SystemMessage(content="You are a helpful career assistant."),
        HumanMessage(content=prompt)
    ])

    return {
        "summary_feedback": response.content
    }
