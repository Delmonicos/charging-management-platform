/* eslint-disable */
import React, { useState, useEffect } from 'react';
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

const ManageTariff = () => {
  const classes = useStyles();
  const [tarif, setTarif] = useState('');
  const [newTarif, setNewTarif] = useState('');

  const getTariff = () => {
    DelmonicosService
      .getCurrentTariff()
      .then((tariff) => {
        setTarif(tariff);
      });
  };

  const handleInput = (tarif) => {
    DelmonicosService
      .changeTariff(parseInt(tarif))
      .then(() => getTariff())
  };

  useEffect(() => getTariff(), []);

  return (
    <Page
      className={classes.root}
      title="Charger"
    >
      <Container maxWidth={false}>
        <Box mt={3}>
          <p>Tarif actuelle pour les bornes Delmonicos : {tarif} €</p>
          <p>Pour changer les tarifs veuillez le nouveau tarif ci dessous</p>
          <input placeholder="nouveau tarif" onChange={(e) => setNewTarif(e.target.value)} value={newTarif} />
        </Box>
        <button type="button" onClick={() => handleInput(newTarif)}>Input</button>
      </Container>
    </Page>
  );
};

export default ManageTariff;
