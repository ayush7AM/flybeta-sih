"""
Mock AI service for the Project Architect feature.
Returns hardcoded project blueprints for frontend development.

TODO: Replace with real Gemini API integration in a later phase.
"""


def generate_project_blueprint(prompt):
    """
    Generate a step-by-step project blueprint from a user prompt.

    Currently returns a hardcoded blueprint for frontend development.
    The prompt is accepted but not used until the real AI API is integrated.

    Args:
        prompt (str): The user's project description.

    Returns:
        list[dict]: A list of project steps, each with:
            - step_number (int)
            - tag (str): Short uppercase category tag
            - title (str): Step title
            - tasks (list[str]): Checklist items for this step
            - estimate (str): Time estimate
    """
    return [
        {
            "step_number": 1,
            "tag": "DATA_PREP",
            "title": "Corpus Curation & Sanitization",
            "tasks": [
                "Aggregate raw text logs",
                "Remove PII tokens",
                "Normalize encoding and formatting",
            ],
            "estimate": "2 Weeks",
        },
        {
            "step_number": 2,
            "tag": "MODEL_SEL",
            "title": "Architecture Evaluation",
            "tasks": [
                "Benchmark 7B vs 13B params",
                "Test latency constraints",
                "Evaluate memory footprint",
            ],
            "estimate": "1 Week",
        },
        {
            "step_number": 3,
            "tag": "FINE_TUNE",
            "title": "Instruction LoRA Training",
            "tasks": [
                "Configure hyperparams",
                "Initiate distributed run",
                "Monitor loss convergence",
            ],
            "estimate": "3 Days",
        },
        {
            "step_number": 4,
            "tag": "DEPLOY",
            "title": "Production Deployment & Monitoring",
            "tasks": [
                "Containerize model with FastAPI",
                "Set up CI/CD pipeline",
                "Configure observability dashboards",
            ],
            "estimate": "1 Week",
        },
    ]
