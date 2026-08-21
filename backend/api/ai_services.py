"""
Real AI service for the Project Architect and Code Drishti features.
Uses the official google-genai SDK with Structured Outputs (Pydantic)
to ensure JSON schema compliance.
"""
import os
import json
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

# Ensure we have the API key from Django settings (via .env)
# In a real Django app you'd import settings, but for this standalone file
# we can just read it from os.environ (which was loaded by python-dotenv in settings.py)
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')

# Initialize the Gemini client
# It automatically picks up GEMINI_API_KEY from the environment if present.
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


# ── Pydantic Schemas for Structured Output ───────────────────────────────

class BlueprintStep(BaseModel):
    step_number: int
    tag: str = Field(description="Short uppercase category tag, e.g., DATA_PREP")
    title: str
    tasks: list[str]
    estimate: str

class BlueprintResponse(BaseModel):
    steps: list[BlueprintStep]

class ReviewFinding(BaseModel):
    id: int
    severity: str = Field(description="Must be one of: CRITICAL, WARNING, INFO, STYLE")
    category: str = Field(description="Must be one of: SECURITY, PERFORMANCE, LOGIC, STYLE")
    title: str
    description: str
    suggestion: str
    line_range: str = Field(description="Affected line range, e.g., '12-15' or '42'")

class ReviewResponse(BaseModel):
    findings: list[ReviewFinding]


# ── AI Service Functions ──────────────────────────────────────────────────

def generate_project_blueprint(prompt):
    """
    Generate a step-by-step project blueprint from a user prompt using Gemini.
    """
    if not client:
        # Fallback if no API key is set
        return [
            {
                "step_number": 1,
                "tag": "SETUP_ERROR",
                "title": "Missing API Key",
                "tasks": ["Add GEMINI_API_KEY to backend/.env", "Restart Django server"],
                "estimate": "5 Mins",
            }
        ]

    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are a master software architect. Break down the user's project "
                    "idea into exactly 4 high-level architectural steps. Use a tactile, "
                    "brutalist engineering tone. Ensure 'tag' is a short, uppercase code."
                ),
                response_mime_type="application/json",
                response_schema=BlueprintResponse,
                temperature=0.4,
            ),
        )
        
        # The response text is a JSON string matching BlueprintResponse
        data = json.loads(response.text)
        return data.get("steps", [])
        
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return [
            {
                "step_number": 1,
                "tag": "API_ERROR",
                "title": "Generation Failed",
                "tasks": [f"Error details: {str(e)}"],
                "estimate": "N/A",
            }
        ]


def generate_code_review(code, language="python"):
    """
    Generate a structured code review using Gemini.
    """
    if not client:
        # Fallback if no API key is set
        return [
            {
                "id": 1,
                "severity": "CRITICAL",
                "category": "SECURITY",
                "title": "Missing API Key",
                "description": "The Gemini API key is missing. The Code Drishti feature cannot analyze your code.",
                "suggestion": "Add GEMINI_API_KEY to your backend/.env file and restart the Django server.",
                "line_range": "N/A",
            }
        ]

    try:
        prompt = f"Review the following {language} code:\n\n{code}"
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=(
                    "You are a strict, senior code auditor. Analyze the provided code "
                    "and return exactly 3 to 5 critical or notable findings. "
                    "Categorize them strictly as SECURITY, PERFORMANCE, LOGIC, or STYLE. "
                    "Severity must be exactly one of: CRITICAL, WARNING, INFO, STYLE."
                ),
                response_mime_type="application/json",
                response_schema=ReviewResponse,
                temperature=0.2,
            ),
        )
        
        data = json.loads(response.text)
        return data.get("findings", [])
        
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return [
            {
                "id": 1,
                "severity": "CRITICAL",
                "category": "LOGIC",
                "title": "API Request Failed",
                "description": f"An error occurred while contacting the Gemini API: {str(e)}",
                "suggestion": "Check your network connection and API key quotas.",
                "line_range": "N/A",
            }
        ]
