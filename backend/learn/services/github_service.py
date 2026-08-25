import requests
import re
from django.conf import settings

def fetch_github_repo_content(repo_url):
    """
    Extracts code from a public GitHub repository.
    Fetches the top-level files and concatenates them.
    """
    # Parse owner and repo
    match = re.search(r'github\.com/([^/]+)/([^/]+)', repo_url)
    if not match:
        raise ValueError("Invalid GitHub URL format. Please provide a URL like https://github.com/owner/repo")
    
    owner = match.group(1)
    repo = match.group(2).replace('.git', '').split('/')[0]

    api_url = f"https://api.github.com/repos/{owner}/{repo}/contents"
    
    headers = {
        'Accept': 'application/vnd.github.v3+json',
    }
    if getattr(settings, 'GITHUB_TOKEN', None):
        headers['Authorization'] = f"token {settings.GITHUB_TOKEN}"
    
    response = requests.get(api_url, headers=headers)
    if response.status_code != 200:
        raise ValueError(f"Failed to fetch repository. Ensure it is public. Status: {response.status_code}")
    
    files = response.json()
    if not isinstance(files, list):
        raise ValueError("Failed to list files in repository.")

    concatenated_content = ""
    
    target_extensions = ('.py', '.js', '.jsx', '.ts', '.tsx', '.md', '.json', '.html', '.css')
    target_exact = ['Dockerfile', 'Makefile', 'requirements.txt', 'package.json']
    
    for file_info in files:
        if file_info['type'] == 'file':
            name = file_info['name']
            if name.endswith(target_extensions) or name in target_exact:
                download_url = file_info['download_url']
                if download_url:
                    file_resp = requests.get(download_url, headers=headers)
                    if file_resp.status_code == 200:
                        concatenated_content += f"\n\n{'='*40}\nFILE: {name}\n{'='*40}\n\n"
                        concatenated_content += file_resp.text
    
    if not concatenated_content:
        return "No relevant source code files found in the root directory."
        
    return concatenated_content
