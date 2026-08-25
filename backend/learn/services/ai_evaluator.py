import json
import google.generativeai as genai
from django.conf import settings

# Configure Gemini with the API key from settings
genai.configure(api_key=settings.GEMINI_API_KEY)

def evaluate_code(domain_name, code_content):
    """
    Evaluates capstone code using Google Gemini.
    """
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"Available model: {m.name}")
            
    model = genai.GenerativeModel('gemini-pro')
    
    prompt = f"""You are an expert tech instructor grading a Level 10 Capstone project for the {domain_name} track. Review the following code. Determine if they pass (needs a basic working implementation). Reply ONLY with a valid JSON object matching this schema: {{"score": int (0-100), "passed": boolean, "feedback": "Markdown formatted string with your review, keeping it encouraging but educational."}}
    
Code:

{code_content}"""

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Strip markdown code blocks if the model wrapped the JSON
        if response_text.startswith("```"):
            lines = response_text.split("\n")
            if len(lines) > 1:
                # Remove first line (e.g. ```json)
                lines = lines[1:]
            if lines and lines[-1].strip() == "```":
                # Remove last line
                lines = lines[:-1]
            response_text = "\n".join(lines).strip()
            
        parsed_result = json.loads(response_text)
        return {
            "score": parsed_result.get("score", 0),
            "passed": parsed_result.get("passed", False),
            "feedback": parsed_result.get("feedback", "No feedback provided.")
        }
    except json.JSONDecodeError:
        return {
            "score": 0,
            "passed": False,
            "feedback": f"Failed to parse AI evaluation response.\n\nRaw output:\n{response_text if 'response_text' in locals() else 'Unknown Error'}"
        }
    except Exception as e:
        return {
            "score": 0,
            "passed": False,
            "feedback": f"An error occurred during AI evaluation: {str(e)}"
        }
