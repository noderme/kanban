//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../models/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let {expect} = require('chai');


chai.use(chaiHttp);

//Our parent block
describe('Users', () => {
    beforeEach( (done) => { //Before each test we empty the database
          
         done();   
    });


/*
  * Test the /GET route
  */
  describe('/GET user', () => {
      it('it should GET all the users', (done) => {
        chai.request(server)
            .get('/users/allusers')
            .end((err, res) => {
                expect(res).have.status(200);
                res.body.should.be.a('object');
                //res.body.length.should.be.eql(0);
              done();
            });
      });
  });


// describe('/GET classified', () => {
//   it('it shoud a specific classified',function(done) {
//     chai.request(server)
//         .get('/classifieds')
//         .end(function(err,res){
          
//         expect(res).to.have.status(200);
//         expect(res.body).to.be.an('array');

//         res.body.map((classified) => {
//           expect(classified).to.have.property('_id');
//           expect(classified).to.not.have.property('heading');
//         })
//        // res.body.should.have.length(1);
        
//         done();
//         })
//   })
// })





// describe('/POST user', () => {
//       it('it should not POST a book without password field', (done) => {
//         let user = {
//             username: "Madman",
//             password: "MAd",
//             admin: false
//         }
//         chai.request(server)
//             .post('/register')
//             .send(user)
//             .end((err, res) => {
//                 res.should.have.status(500);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('errors');
//                // res.body.errors.should.have.property('pages');
//                 //res.body.errors.pages.should.have.property('kind').eql('required');
//               done();
//             });
//       });

//  });



});