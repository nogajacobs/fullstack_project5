const axios = require('axios');
const fs = require('fs');

axios.get('https://jsonplaceholder.typicode.com/users')
  .then(response => {
    const data = response.data;

    // Process the data as needed (example: extract specific fields)
    const processedData = data.map(user => ({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      address: {
        street: user.address.street,
        suite: user.address.suite,
        city: user.address.city,
        zipcode: user.address.zipcode,
        geo: {
          lat: user.address.geo.lat,
          lng: user.address.geo.lng
        }
      },
      phone: user.phone,
      website: user.website,
      company: {
        name: user.company.name,
        catchPhrase: user.company.catchPhrase,
        bs: user.company.bs
      }
    }));

    // Prepare dbData with users array
    const dbData = {
      users: processedData
      // Add more resources as needed (e.g., posts, comments)
    };

    // Write dbData to db.json
    fs.writeFile('db.json', JSON.stringify(dbData, null, 2), err => {
      if (err) {
        console.error('Error writing to db.json:', err);
        return;
      }
      console.log('Data successfully written to db.json');
    });
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
