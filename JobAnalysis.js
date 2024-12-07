document.addEventListener('DOMContentLoaded', () => {
    let jobsData = []; // To store job data after upload

    // DOM Elements
    const fileInput = document.getElementById('file-input');
    const jobList = document.getElementById('job-list');
    const jobDetailsContent = document.getElementById('job-details-content');
    const filterLevel = document.getElementById('filter-level');
    const filterType = document.getElementById('filter-type');
    const filterSkill = document.getElementById('filter-skill');
    const sortOptions = document.getElementById('sort-options');

    // Event: File upload
    fileInput.addEventListener('change', handleFileUpload);

    // Event: Filters
    filterLevel.addEventListener('change', applyFiltersAndSorting);
    filterType.addEventListener('change', applyFiltersAndSorting);
    filterSkill.addEventListener('change', applyFiltersAndSorting);

    // Event: Sort
    sortOptions.addEventListener('change', applyFiltersAndSorting);

    // Event: Job click (to show details)
    jobList.addEventListener('click', event => {
        const jobId = event.target.closest('.job-box')?.dataset.id;
        if (jobId) displayJobDetails(jobId);
    });

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                jobsData = JSON.parse(e.target.result);
                populateFilters(jobsData);
                renderJobs(jobsData);
            } catch (error) {
                alert('Invalid JSON format. Please upload a valid job data file.');
            }
        };
        reader.readAsText(file);
    }

    function populateFilters(jobs) {
        // Populate filter options dynamically
        const levels = new Set(jobs.map(job => job.Level));
        const types = new Set(jobs.map(job => job.Type));
        const skills = new Set(jobs.map(job => job.Skill));

        populateSelect(filterLevel, levels);
        populateSelect(filterType, types);
        populateSelect(filterSkill, skills);
    }

    function populateSelect(selectElement, options) {
        selectElement.innerHTML = '<option value="">All</option>';
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option;
            opt.textContent = option;
            selectElement.appendChild(opt);
        });
    }

    function applyFiltersAndSorting() {
        const levelFilter = filterLevel.value;
        const typeFilter = filterType.value;
        const skillFilter = filterSkill.value;
        const sortOption = sortOptions.value;

        let filteredJobs = jobsData;

        // Apply filters
        if (levelFilter) {
            filteredJobs = filteredJobs.filter(job => job.Level === levelFilter);
        }
        if (typeFilter) {
            filteredJobs = filteredJobs.filter(job => job.Type === typeFilter);
        }
        if (skillFilter) {
            filteredJobs = filteredJobs.filter(job => job.Skill === skillFilter);
        }

        // Apply sorting
        filteredJobs.sort((a, b) => {
            switch (sortOption) {
                case 'title-asc':
                    return a.Title.localeCompare(b.Title);
                case 'title-desc':
                    return b.Title.localeCompare(a.Title);
                case 'time-newest':
                    return new Date(b.Posted) - new Date(a.Posted);
                case 'time-oldest':
                    return new Date(a.Posted) - new Date(b.Posted);
                default:
                    return 0;
            }
        });

        renderJobs(filteredJobs);
    }

    function renderJobs(jobs) {
        jobList.innerHTML = ''; // Clear existing jobs

        if (jobs.length === 0) {
            jobList.innerHTML = '<p>No jobs match the selected filters.</p>';
            return;
        }

        jobs.forEach((job, index) => {
            const jobBox = document.createElement('div');
            jobBox.className = 'job-box';
            jobBox.dataset.id = index;

            jobBox.innerHTML = `
                <h3>${job.Title}</h3>
                <p><strong>Posted:</strong> ${job.Posted}</p>
                <p><strong>Type:</strong> ${job.Type}</p>
                <p><strong>Skill:</strong> ${job.Skill}</p>
            `;
            jobList.appendChild(jobBox);
        });
    }

    function displayJobDetails(jobId) {
        const job = jobsData[jobId];
        if (!job) return;

        jobDetailsContent.innerHTML = `
            <h3>${job.Title}</h3>
            <p><strong>Posted:</strong> ${job.Posted}</p>
            <p><strong>Type:</strong> ${job.Type}</p>
            <p><strong>Level:</strong> ${job.Level}</p>
            <p><strong>Skill:</strong> ${job.Skill}</p>
            <p><strong>Detail:</strong> ${job.Detail}</p>
            <a href="${job['Job Page Link']}" target="_blank">View Job Page</a>
        `;
    }
});
