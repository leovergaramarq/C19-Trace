const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Main:root_pass@cluster0.tdivq.mongodb.net/C19?retryWrites=true&w=majority')
    .then(()=>{
        console.log('Connected to mongodb!');
    }).catch((err)=>{
        console.log(err);
    });