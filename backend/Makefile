# Makefile

# Define the Git repository and directory
REPO_URL = https://github.com/CPJKU/madmom#egg=madmom
REPO_DIR = madmom

# Step 1: Clone the repository
clone:
    git clone $(REPO_URL)

# Step 2: Build the .whl file
build:
    cd $(REPO_DIR) && python setup.py bdist_wheel

# Step 3: Copy the .whl file to the current directory
copy_wheel:
    cp $(REPO_DIR)/dist/*.whl .

# Step 4: Remove the cloned repository directory
clean:
    rm -rf $(REPO_DIR)

# Step 5: Run the entire process (clone -> build -> copy -> clean)
install: clone build copy_wheel clean
    pip install *.whl
