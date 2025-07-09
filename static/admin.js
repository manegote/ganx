// Website Manager - Admin Panel JavaScript
// Manages dynamic updates to the static website

// Global state
let projects = {};
let gallery = {};
let categories = ["Business", "Tool", "Mechanical", "Electronics", "Software"];
let imageCategories = ["Photos", "Designs", "PCBs", "Mockups", "Parts"];
let projectTags = [];
let imageTags = [];
let editingProjectId = null;
let editingImageId = null;

// Initialize the admin panel
document.addEventListener("DOMContentLoaded", function () {
  loadInitialData();
  setupEventListeners();
  updateAllStats();
  populateDropdowns();
});

// Load initial data from the website
function loadInitialData() {
  // Load projects from project-detail.js data
  projects = {
    "custom-battery-business": {
      id: "custom-battery-business",
      title: "Custom Lithium Battery Pack Business",
      description:
        "Building a complete business around custom lithium-ion battery pack design and manufacturing for specialized applications.",
      status: "in-progress",
      category: "Business",
      tags: ["Business", "Battery", "Manufacturing", "Custom"],
      coverImage:
        "https://images.unsplash.com/photo-1609392553633-ba5e73b09cca?w=800&h=600&fit=crop",
      readingTime: 12,
      images: [
        "https://images.unsplash.com/photo-1609392553633-ba5e73b09cca?w=800&h=600&fit=crop",
      ],
      startDate: "2023-06-01",
      subprojects: [
        "lithium-pack-tester",
        "spot-welder-controller",
        "modular-case-system",
      ],
      details:
        "# Custom Lithium Battery Pack Business\\n\\nThe goal is to create a complete business ecosystem...",
      technologies: [
        "Lithium-ion",
        "BMS Design",
        "CAD",
        "Manufacturing",
        "Testing",
      ],
      challenges: [
        "Regulatory compliance for battery manufacturing",
        "Quality control at small scale",
      ],
      outcomes: [
        "Established testing infrastructure",
        "Developed assembly processes",
      ],
    },
    "lithium-pack-tester": {
      id: "lithium-pack-tester",
      title: "Lithium Battery Pack Load Tester",
      description:
        "Programmable load tester for safely discharging lithium battery packs to storage voltage before long-term storage.",
      status: "completed",
      category: "Tool",
      tags: ["Battery", "Testing", "Arduino", "Safety"],
      coverImage:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
      readingTime: 8,
      images: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
      ],
      startDate: "2023-11-01",
      completedDate: "2024-01-15",
      parentProject: "custom-battery-business",
      details:
        "# Lithium Battery Pack Load Tester\\n\\nA critical tool for proper lithium battery storage...",
      technologies: ["Arduino", "Power Electronics", "Sensors"],
      challenges: ["Heat dissipation in high-current loads"],
      outcomes: ["Reliable discharge to storage voltage"],
    },
  };

  // Load gallery from gallery.js data
  gallery = {
    "bms-pcb-top": {
      id: "bms-pcb-top",
      title: "BMS PCB Top Layer",
      description:
        "Top layer view of custom Battery Management System PCB with protection circuits and balancing",
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
      tags: ["PCB", "BMS", "Battery", "Protection"],
      category: "PCBs",
      projectId: "custom-battery-business",
    },
    "load-tester-board": {
      id: "load-tester-board",
      title: "Load Tester Control Board",
      description:
        "Arduino-based control board for the lithium battery pack load tester",
      url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop",
      tags: ["PCB", "Arduino", "Testing", "Control"],
      category: "PCBs",
      projectId: "lithium-pack-tester",
    },
  };

  refreshProjectsList();
  refreshImagesList();
}

// Setup event listeners
function setupEventListeners() {
  // Auto-generate IDs from titles
  document
    .getElementById("projectTitle")
    .addEventListener("input", function () {
      if (!editingProjectId) {
        const id = this.value
          .toLowerCase()
          .replace(/[^a-z0-9\\s-]/g, "")
          .replace(/\\s+/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "");
        document.getElementById("projectId").value = id;
      }
    });

  document.getElementById("imageTitle").addEventListener("input", function () {
    if (!editingImageId) {
      const id = this.value
        .toLowerCase()
        .replace(/[^a-z0-9\\s-]/g, "")
        .replace(/\\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      document.getElementById("imageId").value = id;
    }
  });

  // Tag input handlers
  setupTagInput("projectTagInput", "projectTagsContainer", projectTags);
  setupTagInput("imageTagInput", "imageTagsContainer", imageTags);

  // Form submissions
  document
    .getElementById("projectForm")
    .addEventListener("submit", handleProjectSubmit);
  document
    .getElementById("imageForm")
    .addEventListener("submit", handleImageSubmit);
}

// Setup tag input functionality
function setupTagInput(inputId, containerId, tagsArray) {
  const input = document.getElementById(inputId);
  const container = document.getElementById(containerId);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = this.value.trim();
      if (tag && !tagsArray.includes(tag)) {
        tagsArray.push(tag);
        updateTagsDisplay(containerId, tagsArray);
        this.value = "";
      }
    }
  });

  function updateTagsDisplay(containerId, tagsArray) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    tagsArray.forEach((tag, index) => {
      const tagElement = document.createElement("span");
      tagElement.className = "tag";
      tagElement.innerHTML = `${tag} <span class="remove" onclick="removeTag('${containerId}', ${index})">×</span>`;
      container.appendChild(tagElement);
    });
  }

  // Initial display
  updateTagsDisplay(containerId, tagsArray);
}

// Remove tag function
function removeTag(containerId, index) {
  if (containerId === "projectTagsContainer") {
    projectTags.splice(index, 1);
    updateTagsDisplay("projectTagsContainer", projectTags);
  } else {
    imageTags.splice(index, 1);
    updateTagsDisplay("imageTagsContainer", imageTags);
  }
}

function updateTagsDisplay(containerId, tagsArray) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  tagsArray.forEach((tag, index) => {
    const tagElement = document.createElement("span");
    tagElement.className = "tag";
    tagElement.innerHTML = `${tag} <span class="remove" onclick="removeTag('${containerId}', ${index})">×</span>`;
    container.appendChild(tagElement);
  });
}

// Tab switching
function switchTab(tabName) {
  // Remove active class from all tabs and contents
  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  // Add active class to selected tab and content
  event.target.classList.add("active");
  document.getElementById(tabName + "-tab").classList.add("active");
}

// Project management functions
function handleProjectSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const projectData = {
    id: formData.get("projectId") || document.getElementById("projectId").value,
    title:
      formData.get("projectTitle") ||
      document.getElementById("projectTitle").value,
    description:
      formData.get("projectDescription") ||
      document.getElementById("projectDescription").value,
    status:
      formData.get("projectStatus") ||
      document.getElementById("projectStatus").value,
    category:
      formData.get("projectCategory") ||
      document.getElementById("projectCategory").value,
    tags: [...projectTags],
    coverImage:
      formData.get("projectCoverImage") ||
      document.getElementById("projectCoverImage").value,
    readingTime:
      parseInt(
        formData.get("projectReadingTime") ||
          document.getElementById("projectReadingTime").value,
      ) || 5,
    images: [
      formData.get("projectCoverImage") ||
        document.getElementById("projectCoverImage").value,
    ].filter((img) => img),
    startDate:
      formData.get("projectStartDate") ||
      document.getElementById("projectStartDate").value,
    completedDate:
      formData.get("projectCompletedDate") ||
      document.getElementById("projectCompletedDate").value ||
      null,
    details:
      formData.get("projectDetails") ||
      document.getElementById("projectDetails").value,
    technologies: (
      formData.get("projectTechnologies") ||
      document.getElementById("projectTechnologies").value
    )
      .split("\\n")
      .filter((t) => t.trim()),
    challenges: (
      formData.get("projectChallenges") ||
      document.getElementById("projectChallenges").value
    )
      .split("\\n")
      .filter((c) => c.trim()),
    outcomes: (
      formData.get("projectOutcomes") ||
      document.getElementById("projectOutcomes").value
    )
      .split("\\n")
      .filter((o) => o.trim()),
  };

  // Clean null values
  Object.keys(projectData).forEach((key) => {
    if (projectData[key] === null || projectData[key] === "") {
      delete projectData[key];
    }
  });

  projects[projectData.id] = projectData;

  showMessage("Project saved successfully!", "success");
  refreshProjectsList();
  updateAllStats();
  clearProjectForm();
  generateProjectCode();
}

function editProject(id) {
  const project = projects[id];
  if (!project) return;

  editingProjectId = id;
  document.getElementById("projectFormTitle").textContent = "✏️ Edit Project";

  // Populate form
  document.getElementById("projectId").value = project.id;
  document.getElementById("projectTitle").value = project.title;
  document.getElementById("projectDescription").value = project.description;
  document.getElementById("projectStatus").value = project.status;
  document.getElementById("projectCategory").value = project.category;
  document.getElementById("projectStartDate").value = project.startDate;
  document.getElementById("projectCompletedDate").value =
    project.completedDate || "";
  document.getElementById("projectCoverImage").value = project.coverImage || "";
  document.getElementById("projectReadingTime").value =
    project.readingTime || 5;
  document.getElementById("projectDetails").value = project.details || "";
  document.getElementById("projectTechnologies").value = (
    project.technologies || []
  ).join("\\n");
  document.getElementById("projectChallenges").value = (
    project.challenges || []
  ).join("\\n");
  document.getElementById("projectOutcomes").value = (
    project.outcomes || []
  ).join("\\n");

  // Set tags
  projectTags = [...(project.tags || [])];
  updateTagsDisplay("projectTagsContainer", projectTags);
}

function deleteProject(id) {
  if (
    confirm(
      "Are you sure you want to delete this project? This action cannot be undone.",
    )
  ) {
    delete projects[id];
    refreshProjectsList();
    updateAllStats();
    generateProjectCode();
    showMessage("Project deleted successfully!", "success");
  }
}

function clearProjectForm() {
  document.getElementById("projectForm").reset();
  editingProjectId = null;
  projectTags = [];
  updateTagsDisplay("projectTagsContainer", projectTags);
  document.getElementById("projectFormTitle").textContent =
    "➕ Add New Project";
}

// Gallery management functions
function handleImageSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const imageData = {
    id: formData.get("imageId") || document.getElementById("imageId").value,
    title:
      formData.get("imageTitle") || document.getElementById("imageTitle").value,
    description:
      formData.get("imageDescription") ||
      document.getElementById("imageDescription").value,
    url: formData.get("imageUrl") || document.getElementById("imageUrl").value,
    tags: [...imageTags],
    category:
      formData.get("imageCategory") ||
      document.getElementById("imageCategory").value,
    projectId:
      formData.get("imageProject") ||
      document.getElementById("imageProject").value ||
      undefined,
  };

  // Clean undefined values
  Object.keys(imageData).forEach((key) => {
    if (imageData[key] === undefined || imageData[key] === "") {
      delete imageData[key];
    }
  });

  gallery[imageData.id] = imageData;

  showMessage("Image saved successfully!", "success");
  refreshImagesList();
  updateAllStats();
  clearImageForm();
  generateGalleryCode();
}

function editImage(id) {
  const image = gallery[id];
  if (!image) return;

  editingImageId = id;
  document.getElementById("imageFormTitle").textContent = "✏️ Edit Image";

  // Populate form
  document.getElementById("imageId").value = image.id;
  document.getElementById("imageTitle").value = image.title;
  document.getElementById("imageDescription").value = image.description;
  document.getElementById("imageUrl").value = image.url;
  document.getElementById("imageCategory").value = image.category;
  document.getElementById("imageProject").value = image.projectId || "";

  // Set tags
  imageTags = [...(image.tags || [])];
  updateTagsDisplay("imageTagsContainer", imageTags);
}

function deleteImage(id) {
  if (confirm("Are you sure you want to delete this image?")) {
    delete gallery[id];
    refreshImagesList();
    updateAllStats();
    generateGalleryCode();
    showMessage("Image deleted successfully!", "success");
  }
}

function clearImageForm() {
  document.getElementById("imageForm").reset();
  editingImageId = null;
  imageTags = [];
  updateTagsDisplay("imageTagsContainer", imageTags);
  document.getElementById("imageFormTitle").textContent = "➕ Add New Image";
}

// Refresh lists
function refreshProjectsList() {
  const container = document.getElementById("projectsList");
  container.innerHTML = "";

  Object.values(projects).forEach((project) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
            <div class="item-info">
                <h3>${project.title}</h3>
                <p>Status: ${project.status} | Category: ${project.category} | Started: ${project.startDate}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary" onclick="editProject('${project.id}')">✏️ Edit</button>
                <button class="btn btn-danger" onclick="deleteProject('${project.id}')">🗑️ Delete</button>
            </div>
        `;
    container.appendChild(item);
  });
}

function refreshImagesList() {
  const container = document.getElementById("imagesList");
  container.innerHTML = "";

  Object.values(gallery).forEach((image) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerHTML = `
            <div class="item-info">
                <h3>${image.title}</h3>
                <p>Category: ${image.category} | Tags: ${(image.tags || []).join(", ")}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary" onclick="editImage('${image.id}')">✏️ Edit</button>
                <button class="btn btn-danger" onclick="deleteImage('${image.id}')">🗑️ Delete</button>
            </div>
        `;
    container.appendChild(item);
  });
}

// Statistics
function updateAllStats() {
  const projectValues = Object.values(projects);
  const imageValues = Object.values(gallery);

  // Project stats
  document.getElementById("totalProjects").textContent = projectValues.length;
  document.getElementById("completedProjects").textContent =
    projectValues.filter((p) => p.status === "completed").length;
  document.getElementById("activeProjects").textContent = projectValues.filter(
    (p) => p.status === "in-progress",
  ).length;
  document.getElementById("projectCategories").textContent = new Set(
    projectValues.map((p) => p.category),
  ).size;

  // Image stats
  document.getElementById("totalImages").textContent = imageValues.length;
  document.getElementById("imageCategories").textContent = new Set(
    imageValues.map((i) => i.category),
  ).size;
  document.getElementById("imageTags").textContent = new Set(
    imageValues.flatMap((i) => i.tags || []),
  ).size;
  document.getElementById("linkedImages").textContent = imageValues.filter(
    (i) => i.projectId,
  ).length;
}

// Category management
function addCategory() {
  const input = document.getElementById("newCategoryInput");
  const category = input.value.trim();
  if (category && !categories.includes(category)) {
    categories.push(category);
    populateDropdowns();
    input.value = "";
    showMessage("Category added successfully!", "success");
  }
}

function addImageCategory() {
  const input = document.getElementById("newImageCategoryInput");
  const category = input.value.trim();
  if (category && !imageCategories.includes(category)) {
    imageCategories.push(category);
    populateDropdowns();
    input.value = "";
    showMessage("Image category added successfully!", "success");
  }
}

function populateDropdowns() {
  // Project categories
  const projectCategorySelect = document.getElementById("projectCategory");
  projectCategorySelect.innerHTML = '<option value="">Select Category</option>';
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    projectCategorySelect.appendChild(option);
  });

  // Image categories
  const imageCategorySelect = document.getElementById("imageCategory");
  imageCategorySelect.innerHTML = '<option value="">Select Category</option>';
  imageCategories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    imageCategorySelect.appendChild(option);
  });

  // Project associations for images
  const imageProjectSelect = document.getElementById("imageProject");
  imageProjectSelect.innerHTML =
    '<option value="">No Project Association</option>';
  Object.values(projects).forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.title;
    imageProjectSelect.appendChild(option);
  });
}

// Code generation
function generateProjectCode() {
  const code = `// Project data for static website
// Generated by Website Manager

const projectsData = ${JSON.stringify(projects, null, 2)};

document.addEventListener("DOMContentLoaded", function () {
  // Get project ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");

  if (!projectId || !projectsData[projectId]) {
    // Redirect to projects page if invalid ID
    window.location.href = "projects.html";
    return;
  }

  const project = projectsData[projectId];

  // Populate page content
  populateProjectDetail(project);
});

// [Rest of the existing project-detail.js functions...]
// Copy the remaining functions from the original file`;

  document.getElementById("projectCodeOutput").textContent = code;
  document.getElementById("projectCodeSection").style.display = "block";
}

function generateGalleryCode() {
  const code = `// Gallery data for static website
// Generated by Website Manager

const galleryData = ${JSON.stringify(gallery, null, 2)};

document.addEventListener("DOMContentLoaded", function () {
  // [Rest of the existing gallery.js functions...]
  // Copy the remaining functions from the original file
});

// [Modal and other functions...]
// Copy the remaining functions from the original file`;

  document.getElementById("galleryCodeOutput").textContent = code;
  document.getElementById("galleryCodeSection").style.display = "block";
}

// Utility functions
function showMessage(message, type) {
  const messageEl = document.getElementById(
    type === "success" ? "successMessage" : "errorMessage",
  );
  messageEl.textContent = message;
  messageEl.style.display = "block";
  setTimeout(() => {
    messageEl.style.display = "none";
  }, 3000);
}

function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  const text = element.textContent;
  navigator.clipboard.writeText(text).then(() => {
    showMessage("Code copied to clipboard!", "success");
  });
}

function backupData() {
  const backup = {
    projects: projects,
    gallery: gallery,
    categories: categories,
    imageCategories: imageCategories,
    timestamp: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `website-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showMessage("Backup downloaded successfully!", "success");
}

function resetAllData() {
  if (
    confirm("Are you sure you want to reset ALL data? This cannot be undone!")
  ) {
    if (
      confirm(
        "This will delete ALL projects and images. Are you absolutely sure?",
      )
    ) {
      projects = {};
      gallery = {};
      refreshProjectsList();
      refreshImagesList();
      updateAllStats();
      showMessage("All data has been reset!", "success");
    }
  }
}

console.log("Website Manager loaded successfully!");
