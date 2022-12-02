const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const express = require('express');
const bodyParser = require("body-parser");

const app = express();

function getClient() {
    const uri = "mongodb+srv://admin:0C40jjDPPTbji9Iw@clusterdatabase.l9w4xco.mongodb.net/?retryWrites=true&w=majority";
    return new MongoClient(uri, {
        useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1
    });
}

// GET /api/students
app.get('/api/students', (req, res) => {
    const client = getClient();
    client.connect(async (err) => {
        const collection = client.db("school_app").collection("students");
        // perform actions on the collection object

        const students = await collection.find().toArray();
        res.send(students);

        client.close();
    });
})

function getId(raw) {
    try {
        return new ObjectId(raw);
    } catch (e) {
        return "";
    }
}

// GET /api/student/:id
app.get('/api/student/:id', (req, res) => {
    const id = getId(req.params.id);

    if (!id) {
        res.send({error: "Invalid id"})
        return;
    }

    const client = getClient();
    client.connect(async (err) => {
        const collection = client.db("school_app").collection("students");
        // perform actions on the collection object

        const student = await collection.findOne({_id: id});

        if (!student) {
            res.send({error: "Not found"});
            return;
        }

        res.send(student);

        client.close();
    });
})

// DELETE /api/student/:id
app.delete('/api/student/:id', (req, res) => {
    const id = getId(req.params.id);

    if (!id) {
        res.send({error: "Invalid id"})
        return;
    }

    const client = getClient();
    client.connect(async (err) => {
        const collection = client.db("school_app").collection("students");
        // perform actions on the collection object

        const student = await collection.deleteOne({_id: id});

        if (!student) {
            res.send({error: "Not found"});
            return;
        }

        res.send({id: req.params.id});

        client.close();
    });
})

// POST /api/student/:id
app.post('/api/student/:id', bodyParser.json(), (req, res) => {
    const newStudent = {
        keresztnev: req.params.keresztnev, vezeteknev: req.params.vezeteknev, szuletesi_ev: req.params.szuletesi_ev, osztalyzat: []
    }

    const client = getClient();
    client.connect(async (err) => {
        const collection = client.db("school_app").collection("students");
        // perform actions on the collection object

        const result = await collection.insertOne(newStudent);

        if (!result.insertedId) {
            res.send({error: "Insert failed"});
            return;
        }

        res.send(newStudent);

        client.close();
    });
})

// PUT /api/student/:id
app.put('/api/student/:id', bodyParser.json(), (req, res) => {
    const updatedStudent = {
        keresztnev: req.params.keresztnev,
        vezeteknev: req.params.vezeteknev,
        szuletesi_ev: req.params.szuletesi_ev
    }

    const id = getId(req.params.id);

    if (!id) {
        res.send({error: "Invalid id"})
        return;
    }

    const client = getClient();
    client.connect(async (err) => {
        const collection = client.db("school_app").collection("students");
        // perform actions on the collection object

        const result = await collection.findOneAndUpdate({_id: id}, {$set: updatedStudent}, {returnDocument: "after"});

        if (!result) {
            res.send({error: "Not found"});
            return;
        }

        res.send(result.value);

        client.close();
    });
})

// POST /api/osztalyzat/:id
app.post('/api/osztalyzat/:id', bodyParser.json(), (req, res) => {
    const newOsztalyzat = req.body;

    const id = getId(req.params.id);

    if (!id) {
        res.send({error: "Invalid id"})
        return;
    }

    const client = getClient();
    client.connect(async (err) => {
        const collection = client.db("school_app").collection("students");
        // perform actions on the collection object

        const result = await collection.findOneAndUpdate({_id: id}, {$push: {osztalyzat: newOsztalyzat}}, {returnDocument: "after"});

        if (!result) {
            res.send({error: "Not found"});
            return;
        }

        res.send(result.value);

        client.close();
    });
})

app.listen(3000)