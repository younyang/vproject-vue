const functions = require('firebase-functions');
const admin = require('firebase-admin');
const FieldValue = admin.firestore.FieldValue;
admin.initializeApp(functions.config().firebase);

const db = admin.firestore();

const moment = require('moment');
const express = require('express');
const api = express();

const getDocs = doc => {
  let data = doc.data();
  return {
    result: 'Success',
    resultData: { data: Object.assign({}, data, { id: doc.id }) }
  };
};

const getCollection = snapshot => {
  const collection = [];
  snapshot.forEach(doc => {
    collection.push(getDocs(doc).resultData.data)
  });
  return {
    result: 'Success',
    resultData: { data: collection }
  };
};

const getObject = snapshot => {
  const object = {};
  snapshot.forEach(doc => {
    object[doc.id] = doc.data();
  });
  return object;
};

/** Services */
// GET
api.get('/api/services', (req, res) => {
  db.collection('services').get().then(snapshot => {
    res.send(getCollection(snapshot));
  })
});
// POST
api.post('/api/services', (req, res) => {
  db.collection('services').add(Object.assign({}, req.body, {
    createDateTime: moment().format('YYYY-MM-DD HH:mm:ss')
  })).then(doc => {
    res.send(doc.id);
  })
});
// PUT
api.put('/api/services/:id', (req, res) => {
  db.collection('services').doc(`${req.params.id}`).update(Object.assign({}, req.body, {
    modifyDateTime: moment().format('YYYY-MM-DD HH:mm:ss')
  })).then(doc => {
    res.send(doc);
  })
});
// DELETE
api.delete('/api/services/:id', (req, res) => {
  db.collection('services').doc(`${req.params.id}`).delete().then(doc => {
    res.send(`Success delete :: ${doc.id}`);
  })
});
// GET (:id)
api.get('/api/services/:id', (req, res) => {
  db.collection('services').doc(`${req.params.id}`).get().then(doc => {
    res.send(Object.assign({},getDocs(doc),{
      createId: 'SYSTEM',
      modifyId: 'SYSTEM',
      deploy: {
        status: false,
        count: 1234
      }
    }));
  })
});

/** Services > Origin */
// GET
api.get('/api/services/:id/origin', (req, res) => {
  db.collection(`services/${req.params.id}/origin`).get().then(snapshot => {
    res.send(getObject(snapshot));
  });
});


/**
 * Code
 */
// Account
api.get('/api/account', (req, res) => {
  db.collection('account').get().then(snapshot => {
    res.send(getCollection(snapshot));
  })
});
// Common Code
api.get('/api/system/commonCode/:codeType', (req, res) => {
  db.collection(`system/commonCode/${req.params.codeType}`).get().then(snapshot => {
    res.send(getCollection(snapshot));
  })
});


exports.api = functions.https.onRequest(api);
