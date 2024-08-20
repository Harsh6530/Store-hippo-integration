const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // for parsing application/json

// Directly include the database name in the URI
const uri = "mongodb+srv://sambhav:UrvannGenie01@urvanngenie.u7r4o.mongodb.net/store_hippo?retryWrites=true&w=majority&appName=UrvannGenie";

// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB successfully using Mongoose.');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

// Define a very flexible schema using Schema.Types.Mixed
const orderSchema = new mongoose.Schema({
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    receivedAt: {
        type: Date,
        default: Date.now
    }
});

// Create a model from the schema
const Order = mongoose.model('Order', orderSchema);

app.post('/webhook/order-creation', async (req, res) => {
    console.log('Received a new Customer Creation webhook event.');

    try {
       
        
        // Save the entire request body under the "data" field
        const newOrder = new Order({ data: req.body });
        const result = await newOrder.save();

        

        res.status(200).send('Customer data stored successfully');
    } catch (error) {
        console.error('Error occurred while storing customer data:', error);
        res.status(500).send('Error storing customer data');
    }
});

app.listen(3000, () => {
    console.log('Webhook receiver is listening on port 3000');
});
