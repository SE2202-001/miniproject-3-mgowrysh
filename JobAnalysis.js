document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("file-input");
    const filterLevel = document.getElementById("filter-level");
    const filterType = document.getElementById("filter-type");
    const filterSkill = document.getElementById("filter-skill");
    const applyFiltersButton = document.getElementById("apply-filters");
    const jobList = document.getElementById("job-list");

    let jobs = [];
    let filteredJobs = [];

    // Handle file upload
    fileInput.addEventListener("change", event => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    jobs = JSON.parse(e.target.result);
                    populateFilters(jobs);
                    filteredJobs = [...jobs];
                    renderJobs(filteredJobs);
                } catch (err) {
                    alert("Invalid JSON format.");
                }
            };
            reader.readAsText(file);
        }
    });

    // Populate filters with unique options
    function populateFilters(jobs) {
        const levels = new Set();
        const types = new Set();
        const skills = new Set();

        jobs.forEach(job => {
            levels.add(job.Level);
            types.add(job.Type);
            skills.add(job.Skill);
        });

        populateSelect(filterLevel, levels);
        populateSelect(filterType, types);
        populateSelect(filterSkill, skills);
    }

    function populateSelect(selectElement, options) {
        selectElement.innerHTML = '<option value="">All</option>';
        options.forEach(option => {
            const opt = document.createElement("option");
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });
    }

    // Apply filters
    applyFiltersButton.addEventListener("click", () => {
        const selectedLevel = filterLevel.value;
        const selectedType = filterType.value;
        const selectedSkill = filterSkill.value;

        filteredJobs = jobs.filter(job => {
            return (
                (selectedLevel === "" || job.Level === selectedLevel) &&
                (selectedType === "" || job.Type === selectedType) &&
                (selectedSkill === "" || job.Skill === selectedSkill)
            );
        });

        renderJobs(filteredJobs);
    });

    // Render jobs list
    function renderJobs(jobs) {
        jobList.innerHTML = jobs.length
            ? jobs
                  .map(
                      job => `
                    <div class="job-box">
                        <h3>${job.Title}</h3>
                        <p><strong>Posted:</strong> ${job.Posted}</p>
                        <p><strong>Type:</strong> ${job.Type}</p>
                        <p><strong>Level:</strong> ${job.Level}</p>
                        <p><strong>Skill:</strong> ${job.Skill}</p>
                        <a href="${job["Job Page Link"]}" target="_blank">View Job</a>
                    </div>
                `
                  )
                  .join("")
            : "<p>No jobs match your criteria.</p>";
    }
});
