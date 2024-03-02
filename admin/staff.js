// // Function to delete a staff member by ID
// async function deleteStaff(id, row) {
//     try {
//         const response = await fetch(`http://localhost:5001/staff/${id}`, {
//             method: 'DELETE'
//         });
//         const data = await response.json();
//         console.log(data); // Log success message
//         // Remove the row from the table
//         row.remove();
//     } catch (error) {
//         console.error('Error deleting staff:', error);
//     }
// }

// // Fetch staff data and populate the table
// fetch('http://localhost:5001/staff')
//     .then(response => response.json())
//     .then(data => {
//         const tableBody = document.querySelector('.body');
//         data.forEach(staff => {
//             staff.buildings.forEach(building => {
//                 const timestamp = new Date(staff.timestamp_column).toLocaleString();
//                 const row = document.createElement('tr');
//                 row.innerHTML = `
//                     <td>${staff.staff_id}</td>
//                     <td>${staff.staff_first_name} ${staff.staff_last_name}</td>
//                     <td>${staff.staff_phone_number}</td>
//                     <td>${staff.staff_email}</td>
//                     <td>${building.building_name}</td>
//                     <td>${timestamp}</td>
//                     <td>
//                         <button class="btn btn-sm btn-primary rounded edit-btn" data-staff-id="${staff.staff_id}" style="background-color: #6695FF;border-color: #6695FF;">Edit</button> &nbsp;
//                         <button class="btn btn-sm btn-danger rounded delete-btn" data-staff-id="${staff.staff_id}">Delete</button>
//                     </td>
//                 `;
//                 tableBody.appendChild(row);
//             })
//         });

//         // Add event listeners to delete buttons
//         const deleteButtons = document.querySelectorAll('.delete-btn');
//         deleteButtons.forEach(button => {
//             button.addEventListener('click', () => {
//                 const staffId = button.getAttribute('data-staff-id');
//                 const row = button.closest('tr'); // Get the closest row element
//                 deleteStaff(staffId, row);
//             });
//         });

//         const editButtons = document.querySelectorAll('.edit-btn');
//         editButtons.forEach(button => {
//             button.addEventListener('click', async (event) => {
//                 const staffId = button.getAttribute('data-staff-id');
//                 console.log('Edit button clicked for staff ID:', staffId);
//                 // Redirect to edit_staff.html with staff ID as query parameter
//                 window.location.href = `edit_staff.html?id=${staffId}`;
//             });
//         });

//     })
//     .catch(error => console.error('Error fetching staff data:', error));

// // Fetch staff information for editing only if staffId exists and on the edit page
// const urlParams = new URLSearchParams(window.location.search);
// const staffId = urlParams.get('id');

// if (staffId && window.location.pathname.includes('edit_staff.html')) {
//     fetch(`http://localhost:5001/staff/${staffId}`)
//         .then(response => response.json())
//         .then(data => {
//             if (Array.isArray(data) && data.length > 0) {
//                 const staff = data[0];
//                 console.log('Staff:', staff);
//                 staff.buildings.forEach(building => {
//                     console.log('Building:', building);
//                 });

//                 document.getElementById('staffFirstName').value = staff.staff_first_name;
//                 document.getElementById('staffLastName').value = staff.staff_last_name;
//                 document.getElementById('staffEmail').value = staff.staff_email;
//                 document.getElementById('staffPassword').value = staff.staff_password;
//                 document.getElementById('staffPhone').value = staff.staff_phone_number;
//                 document.getElementById('staffAddress').value = staff.staff_address;

//                 // Select the correct building in the dropdown
//                 const buildingSelect = document.getElementById('buildingSelect');
//                 const selectedBuilding = staff.buildings[0].building_name; // Access building name from the first element of the buildings array
//                 const buildingOptions = buildingSelect.options;

//                 // Log all option values for debugging
//                 for (let i = 0; i < buildingOptions.length; i++) {
//                     console.log(buildingOptions[i].value);
//                 }

//                 console.log('Selected Building:', selectedBuilding);

//                 // Iterate through options to select the correct one
//                 for (let i = 0; i < buildingOptions.length; i++) {
//                     if (buildingOptions[i].value === selectedBuilding) {
//                         buildingOptions[i].selected = true;
//                         break;
//                     }
//                 }

//                 // Add event listener for form submission
//                 const form = document.getElementById('staffForm-edit');
//                 form.addEventListener('submit', async (event) => {
//                     event.preventDefault();

//                     // Prepare form data to be sent in the PUT request
//                     const formData = new FormData(form);
//                     const formDataObject = {};
//                     formData.forEach((value, key) => {
//                         formDataObject[key] = value;
//                     });

//                     try {
//                         // Send a PUT request to update staff information
//                         const response = await fetch(`http://localhost:5001/staff/${staffId}`, {
//                             method: 'PUT',
//                             headers: {
//                                 'Content-Type': 'application/json'
//                             },
//                             body: JSON.stringify(formDataObject)
//                         });

//                         if (!response.ok) {
//                             throw new Error('Failed to update staff member.');
//                         }

//                         const responseData = await response.json();
//                         console.log(responseData.message); // Log success message

//                         // Redirect to staff page after successful update
//                         window.location.href = 'staff.html';
//                     } catch (error) {
//                         console.error('Error updating staff:', error.message);
//                         // Handle error scenario
//                     }
//                 });
//             } else {
//                 console.error('Staff not found or invalid response');
//             }
//         })
//         .catch(error => console.error('Error fetching staff information:', error));
// }

// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         // Fetch building data
//         const response = await fetch('http://localhost:5001/building');
//         const data = await response.json();

//         // Populate the building dropdown
//         const selectBuilding = document.getElementById('buildingSelect'); // Use getElementById to target the specific select element
//         data.forEach(building => {
//             const option = document.createElement('option');
//             option.textContent = building.building_name;
//             option.value = building.building_name;
//             selectBuilding.appendChild(option);
//         });

//         // Add event listener for form submission
//         const form = document.getElementById('staffForm');
//         form.addEventListener('submit', async (event) => {
//             event.preventDefault();

//             const formData = new FormData(form);
//             const formDataObject = {};
//             formData.forEach((value, key) => {
//                 formDataObject[key] = value;
//             });

//             try {
//                 const response = await fetch('http://localhost:5001/staff', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify(formDataObject)
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to add staff member.');
//                 }

//                 const responseData = await response.json();
//                 console.log(responseData.message); // Log success message

//                 // Redirect or display a success message as needed
//                 window.location.href = 'staff.html'; // Redirect to staff page after successful creation
//             } catch (error) {
//                 console.error('Error adding staff:', error.message);
//                 // Display error message to the user
//             }


//         });
//     } catch (error) {
//         console.error('Error fetching building data:', error);
//     }
// });


// Function to fetch staff data
async function fetchStaff() {
    try {
        const response = await fetch('http://localhost:5001/staff');
        if (!response.ok) {
            throw new Error('Failed to fetch staff data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching staff data:', error);
        throw error; // Re-throw the error to handle it outside
    }
}

// Function to delete staff
async function deleteStaff(id) {
    try {
        const response = await fetch(`http://localhost:5001/staff/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete staff');
        }
        return true; // Indicate successful deletion
    } catch (error) {
        console.error('Error deleting staff:', error);
        throw error; // Re-throw the error to handle it outside
    }
}

// Function to populate the staff table
async function populateStaffTable() {
    try {
        const staffData = await fetchStaff();
        const tableBody = document.querySelector('.body');
        tableBody.innerHTML = ''; // Clear existing rows
        staffData.forEach(staff => {
            staff.buildings.forEach(building => {
                const timestamp = new Date(staff.timestamp_column).toLocaleString();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${staff.staff_id}</td>
                    <td>${staff.staff_first_name} ${staff.staff_last_name}</td>
                    <td>${staff.staff_phone_number}</td>
                    <td>${staff.staff_email}</td>
                    <td>${building.building_name}</td>
                    <td>${timestamp}</td>
                    <td>
                        <button class="btn btn-sm btn-primary rounded edit-btn" data-staff-id="${staff.staff_id}" style="background-color: #6695FF;border-color: #6695FF;">Edit</button> &nbsp;
                        <button class="btn btn-sm btn-danger rounded delete-btn" data-staff-id="${staff.staff_id}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);

            });
        });
    } catch (error) {
        console.error('Error populating staff table:', error);
    }
}


async function handleEditStaff(staffId) {
    try {
        // Redirect to edit_staff.html with staff ID as query parameter
        window.location.href = `edit_staff.html?id=${staffId}`;
        console.log(staffId);
    } catch (error) {
        console.error('Error editing staff:', error);
    }
}


async function initializePage() {
    try {
        // Populate the staff table
        await populateStaffTable();

        // Add event listener for delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const staffId = button.getAttribute('data-staff-id');
                if (confirm('Are you sure you want to delete this staff member?')) {
                    try {
                        await deleteStaff(staffId);
                        await populateStaffTable(); // Refresh the table after deletion
                    } catch (error) {
                        console.error('Error deleting staff:', error);
                    }
                }
            });
        });

        // Add event listener for edit buttons
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            console.log('Edit button clicked'); // Log when edit button is clicked
            button.addEventListener('click', async () => {
                console.log('Edit button clicked'); // Log when edit button is clicked
                const staffId = button.getAttribute('data-staff-id');
                console.log('Staff ID:', staffId); // Log the staff ID
                await handleEditStaff(staffId);
            });
        });

    } catch (error) {
        console.error('Error initializing page:', error);
    }
}


// Initialize the page
document.addEventListener('DOMContentLoaded', initializePage);


// Fetch staff information for editing only if staffId exists and on the edit page
async function editStaffInformation() {
    const urlParams = new URLSearchParams(window.location.search);
    const staffId = urlParams.get('id');

    if (staffId && window.location.pathname.includes('edit_staff.html')) {
        try {
            const response = await fetch(`http://localhost:5001/staff/${staffId}`);
            const data = await response.json();
            
            if (Array.isArray(data) && data.length > 0) {
                const staff = data[0];
                console.log('Staff:', staff);
                staff.buildings.forEach(building => {
                    console.log('Building:', building);
                });

                document.getElementById('staffFirstName').value = staff.staff_first_name;
                document.getElementById('staffLastName').value = staff.staff_last_name;
                document.getElementById('staffEmail').value = staff.staff_email;
                document.getElementById('staffPassword').value = staff.staff_password;
                document.getElementById('staffPhone').value = staff.staff_phone_number;
                document.getElementById('staffAddress').value = staff.staff_address;

                // Fetch building data
                const buildingResponse = await fetch('http://localhost:5001/building');
                const buildingData = await buildingResponse.json();

                // Populate the building dropdown
                const selectBuilding = document.getElementById('buildingSelect'); // Use getElementById to target the specific select element
                buildingData.forEach(building => {
                    const option = document.createElement('option');
                    option.textContent = building.building_name;
                    option.value = building.building_name;
                    selectBuilding.appendChild(option);
                });

                // Select the correct building in the dropdown
                const selectedBuilding = staff.buildings[0].building_name; // Access building name from the first element of the buildings array
                selectBuilding.value = selectedBuilding;

                // Add event listener for form submission
                const form = document.getElementById('staffForm-edit');
                form.addEventListener('submit', async (event) => {
                    event.preventDefault();

                    // Prepare form data to be sent in the PUT request
                    const formData = new FormData(form);
                    const formDataObject = {};
                    formData.forEach((value, key) => {
                        formDataObject[key] = value;
                    });

                    try {
                        // Send a PUT request to update staff information
                        const response = await fetch(`http://localhost:5001/staff/${staffId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(formDataObject)
                        });

                        if (!response.ok) {
                            throw new Error('Failed to update staff member.');
                        }

                        const responseData = await response.json();
                        console.log(responseData.message); // Log success message

                        // Redirect to staff page after successful update
                        window.location.href = 'staff.html';
                    } catch (error) {
                        console.error('Error updating staff:', error.message);
                        // Handle error scenario
                    }
                });
            } else {
                console.error('Staff not found or invalid response');
            }
        } catch (error) {
            console.error('Error fetching staff information:', error);
        }
    }
}

// Call editStaffInformation to fetch and populate staff information
editStaffInformation();
