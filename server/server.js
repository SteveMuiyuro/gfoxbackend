const express = require("express");
const app = express();
const cors = require("cors");
const db = require("./db");
require("dotenv").config();

//Middleware
app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

//Get all Trucks
app.get("/api/v1/trucks", async (req, res) => {
  try {
    const trucksData = await db.query(
      "SELECT * FROM trucks LEFT JOIN (select truckid,COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by truckid) reviews on trucks.id = reviews.truckid;"
    );
    res.status(200).json({
      status: "success",
      results: trucksData.rows.length,
      trucks: trucksData.rows,
    });
  } catch (err) {
    console.log(err);
  }
});

//Get a single truck
app.get("/api/v1/trucks/:id", async (req, res) => {
  try {
    const truckid = req.params.id;
    const truck = await db.query(
      "SELECT * FROM trucks LEFT JOIN (select truckid, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by truckid) reviews on trucks.id = reviews.truckid WHERE id = $1",
      [truckid]
    );

    const reviews = await db.query("select * from reviews where truckid = $1", [
      req.params.id,
    ]);

    res.status(200).json({
      status: "success",
      results: truck.rows.length,
      truckInfo: truck.rows,
      results: reviews.rows.length,
      reviews: reviews.rows,
    });
  } catch (err) {
    console.log(err);
  }
});

//Post a Truck
app.post("/api/v1/trucks", async (req, res) => {
  try {
    const truck_posted = await db.query(
      "INSERT INTO trucks(truck_name, truck_description, truck_image, price, tonnage, type) values($1, $2, $3, $4, $5, $6) returning *",
      [
        req.body.truck_name,
        req.body.truck_description,
        req.body.truck_image,
        req.body.price,
        req.body.tonnage,
        req.body.type,
      ]
    );

    res.status(201).json({
      status: "success",
      truck: truck_posted.rows[0],
    });
  } catch (err) {
    console.log(err);
  }
});

//Update truck
app.put("/api/v1/trucks/:id", async (req, res) => {
  try {
    const truck_updated = await db.query(
      "UPDATE trucks SET truck_name = $1, truck_description = $2, truck_image=$3, price=$4, tonnage=$5, type=$6 WHERE id = $7",
      [
        req.body.truck_name,
        req.body.truck_description,
        req.body.truck_image,
        req.body.price,
        req.body.tonnage,
        req.body.type,
        req.params.id,
      ]
    );

    res.status(200).json({
      status: "success",
      truck: truck_updated[0],
    });
  } catch (err) {
    console.log(err);
  }
});

//Delete Truck
app.delete("/api/v1/trucks/:id", async (req, res) => {
  try {
    const truck_deleted = await db.query("DELETE FROM trucks WHERE id = $1", [
      req.params.id,
    ]);
    res.status(204).json({
      status: "truck deleted",
    });
  } catch (err) {
    console.log(err);
  }
});

//Add Review
app.post("/api/v1/trucks/:id/addReview", async (req, res) => {
  try {
    const { id } = req.params;
    const { firstname, lastname, review, rating } = req.body;
    const newReview = await db.query(
      "INSERT INTO reviews (truckid, firstname,lastname,review,rating) values($1,$2, $3, $4, $5) RETURNING *;",
      [id, firstname, lastname, review, rating]
    );
    console.log(newReview);

    res.status(201).json({
      status: "success",
      review: newReview.rows[0],
    });
  } catch (err) {
    console.log(err);
  }
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
