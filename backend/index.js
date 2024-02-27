const express = require('express');
const app = express();
const port = 5001;
const cors = require("cors");
const pool = require('./db');

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`server is running on ${port}`);
})

// app.get("/", (req, res) => {
//     res.send("hello world");
// })

// get customer data
app.get('/customer', async(req, res) => {
    try {
        //Fetch customer data
        const getCustomer = await pool.query('SELECT * FROM customer');

        //Fetch car data associated with each customer 
        const customers = getCustomer.rows;
        for (const customer of customers) {
            const getCustomerCar = await pool.query("SELECT * FROM car WHERE customer_id = $1", [customer.customer_id]);
            customer.cars = getCustomerCar.rows;
        }
        res.json(customers);
    } catch (error) {
        console.log(error);
    }
});

//get one customer
app.get('/customer/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch customer data for the given ID
        const getCustomerByID = await pool.query("SELECT * FROM customer WHERE customer_id = $1", [id]);
        const customer = getCustomerByID.rows[0]; // Assuming there's only one customer with the given ID

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Fetch car data associated with the customer
        const getCustomerCarByID = await pool.query("SELECT * FROM car WHERE customer_id = $1", [id]);
        const cars = getCustomerCarByID.rows;

        // Attach car data to the customer object
        customer.cars = cars;

        res.json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});


// get staff data
app.get('/staff', async(req,res) => {
    try {
        //Fetch staff data
        const getStaff = await pool.query('SELECT * FROM staff ORDER BY staff_id ASC');

        //Fetch buidling data associated with each staff
        const staffs = getStaff.rows;
        for (const staff of staffs) {
            const getStaffBuilding = await pool.query("SELECT * FROM building WHERE building_id = $1", [staff.building_id]);
            staff.buildings = getStaffBuilding.rows;
        }
        res.json(staffs);
    } catch (error) {
        console.log(error);
    }
}); 

// get staff data by id
app.get('/staff/:id', async(req,res) => {
    try {
        //Fetch staff data
        const {id} = req.params;
        const getStaff = await pool.query('SELECT * FROM staff WHERE staff_id = $1', [id]);

        //Fetch buidling data associated with each staff
        const staffs = getStaff.rows;
        for (const staff of staffs) {
            const getStaffBuilding = await pool.query("SELECT * FROM building WHERE building_id = $1", [staff.building_id]);
            staff.buildings = getStaffBuilding.rows;
        }
        res.json(staffs);
    } catch (error) {
        console.log(error);
    }
}); 

// create staff
app.post('/staff', async (req, res) => {
    try {
        const { staff_first_name, staff_last_name, staff_phone_number, staff_address, staff_email, staff_password, building_name } = req.body;

        // Logging: Print out the values of variables
        console.log("Received request body:", req.body);
        console.log("First Name:", staff_first_name);
        console.log("Last Name:", staff_last_name);
        console.log("Phone:", staff_phone_number);
        console.log("Address:", staff_address);
        console.log("Email:", staff_email);
        console.log("Password:", staff_password);
        console.log("Building:", building_name);

        // Check if the email already exists
        const emailCheck = await pool.query("SELECT * FROM staff WHERE staff_email = $1", [staff_email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: "Email already exists." });
        }

        // Get building_id from building_name
        const buildingQuery = "SELECT building_id FROM building WHERE building_name = $1";
        const buildingResult = await pool.query(buildingQuery, [building_name]);

        // Logging: Print out the result of the query
        console.log("Building Result:", buildingResult.rows);

        if (buildingResult.rows.length === 0) {
            return res.status(404).json({ error: "Building not found." });
        }
        const building_id = buildingResult.rows[0].building_id;

        // Insert new staff member
        const insertQuery = "INSERT INTO staff (staff_first_name, staff_last_name, staff_phone_number, staff_address, staff_email, staff_password, building_id) VALUES ($1, $2, $3, $4, $5, $6, $7)";
        const values = [staff_first_name, staff_last_name, staff_phone_number, staff_address, staff_email, staff_password, building_id];
        await pool.query(insertQuery, values);

        res.status(201).json({ message: "Staff created successfully." });
    } catch (error) {
        console.error("Error adding staff:", error);
        res.status(500).json({ error: "An error occurred while adding staff." });
    }
});


// delete staff by id
app.delete('/staff/:id', async(req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deleteStaff = await pool.query("DELETE FROM staff WHERE staff_id = $1", [id]);
        res.json("Staff delected successfully");
    } catch (error) {
        console.log(error.message);
    }
});


// update staff by id
app.put('/staff/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const { staff_first_name, staff_last_name, staff_phone_number, staff_address, staff_email, staff_password, building_name } = req.body;

        // checking if staff exists
        const getStaffbyID = await pool.query("SELECT * FROM staff WHERE staff_id = $1", [id]);
        if (getStaffbyID.rows.length === 0) {
            return res.status(400).json({ error: "Staff doesn't exist" });
        }

        //checking if the new email already exists in the database
        const emailCheck = await pool.query("SELECT * FROM staff WHERE staff_email = $1 AND staff_id != $2", [staff_email, id]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: "Email already exists." });
        }

        //checking if building exists
        const buildingQuery = "SELECT building_id FROM building WHERE building_name = $1";
        const buildingResult = await pool.query(buildingQuery, [building_name]);

        if (buildingResult.rows.length === 0) {
            return res.status(404).json({ error: "Building not found." });
        } 
        const building_id = buildingResult.rows[0].building_id;

        // Updating staff
        const updateQuery = "UPDATE staff SET staff_first_name = $1, staff_last_name = $2, staff_phone_number= $3, staff_address = $4, staff_email = $5, staff_password = $6, building_id = $7 WHERE staff_id = $8";
        const values = [staff_first_name, staff_last_name, staff_phone_number, staff_address, staff_email, staff_password, building_id, id];
        await pool.query(updateQuery, values);
        res.status(200).json({ message: "Staff updated successfully." });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "An error occurred while updating staff." });
    }
});


// getting all building data
app.get('/building', async (req, res) => {
    try {
        const getBuilding = await pool.query("SELECT * FROM building ORDER BY building_name ASC");
        res.json(getBuilding.rows);
    } catch (error) {
        console.log(error.message);
    }
});

//get building by id
app.get('/building/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const getBuildingbyID = await pool.query("SELECT * FROM building WHERE building_id = $1", [id]);
        res.json(getBuildingbyID.rows);
    } catch (error) {
        console.log(error.message);
    }
});

//adding new building
app.post('/building', async (req, res) => {
    try {
        const { building_name, building_address, building_capacity } = req.body;

        // Check if building name already exists
        const buildingName = await pool.query("SELECT * FROM building WHERE building_name = $1", [building_name]);
        if (buildingName.rows.length > 0) {
            return res.status(400).json({ error: "Building already exists." });
        }

        // Add new building 
        const newBuilding = await pool.query(
            "INSERT INTO building (building_name, building_address, building_capacity) VALUES ($1, $2, $3)",
            [building_name, building_address, building_capacity]
        );
        res.status(201).json({ message: "Building created successfully." });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: "An error occurred while adding building." });
    }
});


//deleting a selected building
app.delete('/building/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const checkStaff = await pool.query("SELECT * FROM staff WHERE staff.building_id = $1", [id]); 
        console.log(checkStaff.rows.length);
        if (checkStaff.rows.length > 0) {
            return res.status(409).json({error: "There are staffs working in that building"});
        }

        // Check if any building was deleted
        const deleteBuilding = await pool.query("DELETE FROM building WHERE building_id = $1", [id]);
        if (deleteBuilding.rowCount === 0) {
            return res.status(404).json({ error: "Building not found." });
        }

        // Send success response
        res.status(200).json({ message: "Building deleted successfully." });
    } catch (error) {
        console.error("Error deleting building:", error.message);
        res.status(500).json({ error: "An error occurred while deleting building." });
    }
});


//updating a selected building
app.put('/building/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const { building_name, building_address, building_capacity} = req.body;

        // Check if building name already exists
        const buildingName = await pool.query("SELECT * FROM building WHERE building_name = $1 AND building_id != $2", [building_name, id]);
        if (buildingName.rows.length > 0) {
            return res.status(400).json({ error: "Building already exists." });
        };

        // Upadting the building
        const updateBuilding = await pool.query(
            "UPDATE building SET building_name = $1, building_address = $2, building_capacity = $3 WHERE building_id = $4",
            [building_name, building_address, building_capacity, id]
        );
    res.status(200).json({message : "Building updated sucessfully"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error : "An error occured while updating building"});
    }
});