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
  const [waiting, setWaiting] = useState(false);

  const getTariff = () => {
    DelmonicosService
      .getCurrentTariff()
      .then((tariff) => {
        setTarif(tariff);
      });
  };

  const handleInput = (tarif) => {
    setWaiting(true);
    DelmonicosService
      .changeTariff(parseInt(tarif))
      .then(() => {
        getTariff();
        alert(`Le tarif a été mis à jour : ${newTarif}`);
        setWaiting(false);
      })
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
          <p>&nbsp;</p>
          <input disabled={waiting} placeholder="nouveau tarif" onChange={(e) => setNewTarif(e.target.value)} value={newTarif} />
          <button style={{marginLeft: 5 + 'px', paddingLeft: 5 + 'px', paddingRight: 5 + 'px'}} type="button" onClick={() => handleInput(newTarif)}>{!waiting ? "Sauvegarder le tarif" : "loading..."}</button>
        </Box>
      </Container>
    </Page>
  );
};

export default ManageTariff;
