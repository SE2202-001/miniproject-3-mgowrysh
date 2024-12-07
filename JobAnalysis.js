document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("file-input");
    const filterLevel = document.getElementById("filter-level");
    const filterType = document.getElementById("filter-type");
    const filterSkill = document.getElementById("filter-skill");
    const sortOptions = document.getElementById("sort-options");
    const applyFiltersButton = document.getElementById("apply-filters");
    const jobList = document.getElementById("job-list");
    const jobDetailsContent = document.getElementById("job-details-content");

    let jobs = [];
    let filteredJobs = [];

    fileInput.addEventListener("change", handleFileUpload);
    applyFiltersButton.addEventListener("click", applyFilters);

    function handleFileUpload(event) {
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
    }

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

    function applyFilters() {
        const selectedLevel = filterLevel.value;
        const selectedType = filterType.value;
        const selectedSkill = filterSkill.value;
        const selectedSort = sortOptions.value;

        filteredJobs = jobs.filter(job => {
            return (
                (selectedLevel === "" || job.Level === selectedLevel) &&
                (selectedType === "" || job.Type === selectedType) &&
                (selectedSkill === "" || job.Skill === selectedSkill)
            );
        });

        if (selectedSort) {
            filteredJobs = sortJobs(filteredJobs, selectedSort);
        }

        renderJobs(filteredJobs);
    }

    function sortJobs(jobs, sortOption) {
        switch (sortOption) {
            case "title-asc":
                return jobs.sort((a, b) => a.Title.localeCompare(b.Title));
            case "title-desc":
                return jobs.sort((a, b) => b.Title.localeCompare(a.Title));
            case "time-newest":
                return jobs.sort((a, b) => parseTime(b.Posted) - parseTime(a.Posted));
            case "time-oldest":
                return jobs.sort((a, b) => parseTime(a.Posted) - parseTime(b.Posted));
            default:
                return jobs;
        }
    }

    function parseTime(postedTime) {
        const timeMap = { minute: 1, hour: 60, day: 1440 };
        const parts = postedTime.split(" ");
        const value = parseInt(parts[0], 10);
        const unit = parts[1].replace(/s$/, ""); // Remove plural 's'
        return value * (timeMap[unit] || 1);
    }

    function renderJobs(jobs) {
        jobList.innerHTML = jobs.length
            ? jobs
                  .map(
                      job => `
                <div class="job-box" data-job-id="${job["Job No"]}">
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
            : "<p>No jobs found.</p>";

        const jobBoxes = document.querySelectorAll(".job-box");
        jobBoxes.forEach(box => box.addEventListener("click", showJobDetails));
    }

    function showJobDetails(event) {
        const jobId = event.currentTarget.dataset.jobId;
        const job = filteredJobs.find(job => job["Job No"] === jobId);
        if (job) {
            jobDetailsContent.innerHTML = `
                <h3>${job.Title}</h3>
                <p><strong>Posted:</strong> ${job.Posted}</p>
                <p><strong>Type:</strong> ${job.Type}</p>
                <p><strong>Level:</strong> ${job.Level}</p>
                <p><strong>Skill:</strong> ${job.Skill}</p>
                <p><strong>Detail:</strong> ${job.Detail}</p>
                <a href="${job["Job Page Link"]}" target="_blank">Go to Job Page</a>
            `;
        }
    }
});