import json
import os
import re
import zipfile

def run_survey():
    data = {

    "answers": {
        "phase": ["architecture", "design", "coding", "deployment"],
        "action": ["microservices definition", "api design", "orchestration design", "choreography design", "data design", "container structuring", "source code authoring", "network operations", "code management"],
        "scope": ["uml sequence", "uml component", "uml deployment", "uml other", "data management", "frontend", "backend", "api", "messaging design", "messaging deployment", "container configuration", "deployment scripts", "github operations"],
        "action experience": [0, 1, 2, 3, 4, 5],
        "prog lang": ["n/a", "js", "js-node", "python", "sql", "nosql", "java", "yaml/json", "other"],
        "other prog lang": "<fill_in>",
        "aimodel": ["chatgpt"],
        "aimodel version": ["4.0"],
        "lmstudio-hosted aimodel": ["No"],
        "tool option": ["online full"],
        "experience with tool": [5],
        "time allocated (h)": "<fill_in>",
        "time saved estimate (h)": "<fill_in>", 
        "quality of ai help": [0, 1, 2, 3, 4, 5],
        "knowledge acquired": [0, 1, 2, 3, 4, 5],
        "generic feeling - now": [0, 1, 2, 3, 4, 5],
        "generic feeling - future": [0, 1, 2, 3, 4, 5],
        "threat level": [5],
        "notes": "<fill_in>"
    }
    }

    responses = {}
    max_length=0
    for key, options in data["answers"].items():
        print()
        if options == "<fill_in>":
            response = input(f"Enter your response for {key}: ")
            if len(response) == 0:
                response="None"
        elif len(options)==1:
            #if there is only one choice
            response=options[0]
            #continue

        else:
            title = f"Choose an option for {key}:"
            print(title)
            print("_" * len(title))
            
            for i, option in enumerate(options):
                # Display the same value and index for numeric lists, otherwise use default index
                if isinstance(option, int):  # If the option is a number, index matches the option
                    print(f"{option} ({option})")
                else:
                    print(f"{option} ({i + 1})")
                #max_length=max(max_length,len(str(option)))
            print("_" * len(title))
            
            choice = int(input("Your choice (number): "))
            
            if isinstance(options[0], int):  # If it's a numeric list, index directly maps to the value
                response = choice  # The choice is the value itself
            else:
                response = options[choice - 1]  # Otherwise, get the option based on index
            
        responses[key] = response
        print()

    return responses

def get_next_filename(phase, directory="."):
    pattern = re.compile(rf"zipped_{phase}_(\d+).zip")
    max_order = 0

    for filename in os.listdir(directory):
        match = pattern.match(filename)
        if match:
            order = int(match.group(1))
            max_order = max(max_order, order)

    next_order = max_order + 1
    return f"{phase}_{next_order}.json"

def log_chat(filename,prompt_filename):
    print("If you dont want a prompt write \"No prompt\"")
    chat_log_path = input("Enter the name of your log file (without .txt): ")
    #prompt_filename
    #chat_log_path="logger.txt"
    if chat_log_path == "No prompt":
        return False
    chat_log_path+=".txt"
    try:
        with open(chat_log_path, 'r', encoding='utf-8') as chat_file:
            lines = chat_file.readlines()
    except FileNotFoundError:
        print("File not found. Please check the path and try again.")
        return True
    

    log_filename = f"prompt_{filename}.txt"

    with open(log_filename, "w", encoding='utf-8') as file:
        for line in lines:
            if line.strip() == "User":
                file.write("User:\n")
                file.write("______\n")
                continue
            if line.strip() == "ChatGPT":
                file.write("ChatGPT:\n")
                file.write("_________\n")
                continue
            file.write(line)

    print(f"Chat log saved to {log_filename}")
    return True


def zip_files(zip_filename, files_to_zip):
    with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for file in files_to_zip:
            zipf.write(file)


responses = run_survey()

phase = responses.get("phase").replace(" ", "_").lower()  # Replace spaces with underscores and convert to lower case
filename = get_next_filename(phase)

# Save JSON responses
with open(filename, "w", encoding='utf-8') as file:
    json.dump({"answers": responses}, file, indent=4)
print(f"Responses saved to {filename}")

# Generate prompt filename with correct extension
prompt = f"prompt_{filename[:-5]}.txt"
done = log_chat(filename[:-5],prompt)  # Pass the base filename without .json extension

# Zip the files
if done:
    zip_files(f"zipped_{filename[:-5]}.zip", [filename, prompt])
    
    
    try:
        os.remove(filename)
        os.remove(prompt)
        print("Files successfully deleted.")
    except FileNotFoundError:
        print("One or both files not found. They may have already been deleted or never existed.")

    
else:
    zip_files(f"zipped_{filename[:-5]}.zip", [filename])
    
    try:
        os.remove(filename) 
        print("File successfully deleted.")
    except FileNotFoundError:
        print("Files not found. It may have already been deleted or never existed.")


print("Visit https://ailog.softlab.ntua.gr/ to submit the zipped file")

