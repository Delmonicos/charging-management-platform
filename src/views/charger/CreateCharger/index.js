/* eslint-disable */
import React, { useState } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';

import KeyringService from '../../../services/Keyring';
import DelmonicosService from '../../../services/Delmonicos';
import { cryptoWaitReady } from '@polkadot/util-crypto';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CreateCharger = () => {
  const classes = useStyles();
  const [id, setId] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [waiting, setWaiting] = useState(false);

  const handleInput = (latitude, longitude) => {
    setWaiting(true);
    try {
      cryptoWaitReady().then(() => {
        KeyringService.generateNewChargerKey().then((chargerKeypair) => {
          DelmonicosService
            .addChargerLocation(latitude, longitude, chargerKeypair.chargerKeypair)
            .then(() => {
              return DelmonicosService.addNewCharger(chargerKeypair.address);
            })
            .then(() => {
              console.log(`Charger ${chargerKeypair.address} added to the chain.`);
              alert(`La nouvelle borne a été ajoutée.`);
              setWaiting(false);
            })
            .catch((e)  => {
              alert(e);
              setWaiting(false);
            });
          });
        });
    } catch(e) {
      alert(e);
        setWaiting(false);
    };
  };

  return (
    <Page
      className={classes.root}
      title="Charger"
    >
      <Container maxWidth={false}>
        <Box mt={3}>
          <p>Afin d&apos;enregistrer une nouvelle borne veuillez renseigner les champs suivants :</p>
          <p>&nbsp;</p>
          <input  disabled={waiting} placeholder="latitude de la borne" onChange={(e) => setLatitude(e.target.value)} />
          <input  disabled={waiting} style={{marginLeft: 5 + 'px'}}  placeholder="longitude de la borne" onChange={(e) => setLongitude(e.target.value)} />
          <button style={{marginLeft: 5 + 'px'}}  type="button" onClick={() => handleInput(latitude, longitude)}>
          <p style={{paddingLeft: 5 + 'px', paddingRight: 5 + 'px'}}>{!waiting ? "Ajouter la nouvelle borne " : "loading..."}</p>
        </button>
        </Box>
      </Container>
    </Page>
  );
};

export default CreateCharger;
