import React, { useState } from 'react';
import {
  Box,
  Container,
  makeStyles
} from '@material-ui/core';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const handleInput = (tarif) => {
  console.log(tarif);
};

const CreateCharger = () => {
  const classes = useStyles();
  const [tarif, setTarif] = useState('');

  return (
    <Page
      className={classes.root}
      title="Charger"
    >
      <Container maxWidth={false}>
        <Box mt={3}>
          <p>Tarif actuelle pour les bornes Delmonicos : 12€</p>
          <p>Pour changer les tarifs veuillez le nouveau tarif ci dessous</p>
          <input placeholder="nouveau tarif" onChange={(e) => setTarif(e.target.value)} />
        </Box>
        <button type="button" onClick={() => handleInput(tarif)}>Input</button>
      </Container>
    </Page>
  );
};

export default CreateCharger;
