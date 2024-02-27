fetch('http://localhost:5001/building')
    .then(response => response.json())
    .then(data => {
        const selectBuilding = document.querySelector('.form-select');

        data.forEach(building => {
            const option = document.createElement('option');
            option.textContent = building.building_name;
            option.value = building.building_id;
            selectBuilding.appendChild(option);
        })
    })
    .catch(error => console.error('Error fetching building data:', error));



