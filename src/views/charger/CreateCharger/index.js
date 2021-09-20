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

  const handleInput = (latitude, longitude) => {
    const chargerKeypair = KeyringService.generateNewChargerKey();
    DelmonicosService
      .addChargerLocation(longitude, latitude, chargerKeypair.chargerKeypair)
      .then(() => {
        return DelmonicosService.addNewCharger(chargerKeypair.address);
      })
      .then(() => {
        console.log(`Charger ${chargerKeypair.address} added to the chain.`);
      });
  };

  return (
    <Page
      className={classes.root}
      title="Charger"
    >
      <Container maxWidth={false}>
        <Box mt={3}>
          <p>Afin d&apos;enregistrer une nouvelle borne veuillez renseigner les champs suivants.</p>
          <p>Latitude du charger :</p>
          <input placeholder="latitude de la borne" onChange={(e) => setLatitude(e.target.value)} />
          <p>Longitude du charger :</p>
          <input placeholder="longitude de la borne" onChange={(e) => setLongitude(e.target.value)} />
        </Box>
        <button type="button" onClick={() => handleInput(id, latitude, longitude)}>
          <p>Créer la nouvelle borne</p>
        </button>
      </Container>
    </Page>
  );
};

export default CreateCharger;
