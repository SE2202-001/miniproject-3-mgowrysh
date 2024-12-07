document.getElementById("file-input").addEventListener("change", handleFileUpload);

let jobs = [];

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const rawContent = e.target.result;
                jobs = JSON.parse(rawContent);

                if (!Array.isArray(jobs)) {
                    throw new Error("Invalid JSON: Expected an array of job objects");
                }

                populateFilters(jobs);
                updateJobList();
            } catch (error) {
                console.error("Error parsing JSON:", error.message);
                displayError("Invalid JSON format. Please check the file content.");
            }
        };
        reader.readAsText(file);
    } else {
        displayError("No file selected. Please upload a JSON file.");
    }
}

function populateFilters(jobs) {
    const levels = new Set();
    const types = new Set();
    const skills = new Set();

    jobs.forEach(job => {
        levels.add(job.Level || "No Data");
        types.add(job.Type || "No Data");
        skills.add(job.Skill || "No Data");
    });

    populateDropdown("filter-level", Array.from(levels));
    populateDropdown("filter-type", Array.from(types));
    populateDropdown("filter-skill", Array.from(skills));
}

function populateDropdown(elementId, options) {
    const dropdown = document.getElementById(elementId);
    dropdown.innerHTML = `<option value="">All</option>`;
    options.forEach(option => {
        dropdown.innerHTML += `<option value="${option}">${option}</option>`;
    });
}

function updateJobList() {
    const jobListContainer = document.getElementById("job-list");
    jobListContainer.innerHTML = "";

    jobs.forEach(job => {
        const jobBox = document.createElement("div");
        jobBox.classList.add("job-box");
        jobBox.innerHTML = `
            <h3>${job.Title}</h3>
            <p>${job.Level} - ${job.Type}</p>
        `;
        jobBox.addEventListener("click", () => displayJobDetails(job));
        jobListContainer.appendChild(jobBox);
    });
}

function displayJobDetails(job) {
    const detailsContainer = document.getElementById("job-details-content");
    detailsContainer.innerHTML = `
        <h3>${job.Title}</h3>
        <p><strong>Job No:</strong> ${job["Job No"]}</p>
        <p><strong>Type:</strong> ${job.Type}</p>
        <p><strong>Level:</strong> ${job.Level}</p>
        <p><strong>Estimated Time:</strong> ${job["Estimated Time"]}</p>
        <p><strong>Skill:</strong> ${job.Skill}</p>
        <p><strong>Detail:</strong> ${job.Detail}</p>
        <p><a href="${job["Job Page Link"]}" target="_blank">View Job</a></p>
    `;
}

function displayError(message) {
    const errorContainer = document.getElementById("upload-error");
    errorContainer.textContent = message;
    setTimeout(() => (errorContainer.textContent = ""), 5000);
}